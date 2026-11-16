const { registerGroupFeatureEvents } = require("./lib/groupFeatureEvents");
const fs = require("fs");
const { loadCommands } = require("./lib/commandLoader");
const shield = require("./lib/shield/shield");
const linkShield = require("./lib/shield/linkShield");
const mediaShield = require("./lib/shield/mediaShield");
const repeatShield = require("./lib/shield/repeatShield");
const joinShield = require("./lib/shield/joinShield");
const shieldAlert = require("./lib/shield/alert");

let commands = new Map();
const express = require("express");
const smartReply = require("./lib/smartReply");
const statusProtection = require("./lib/groupStatusProtection");
const statusStore = require("./lib/groupStatusStore");
const protection = require("./lib/protection");
const antiBot = require("./lib/antiBot");
const pino = require("pino");

const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const app = express();
const PORT = 3000;
const AUTH_DIR = "./auth";

app.use(express.json());
app.use(express.static("public"));

let sock = null;
let status = "STARTING";
let pairingCode = null;
let restarting = false;

/* =========================
   WHATSAPP
========================= */

async function startWhatsApp() {
  commands = loadCommands();

  const { startSession } =
    require("./lib/sessionConnector");

  console.log("🔌 Starting MAIN BOT from SESSION 1...");

  sock = await startSession("1");

  sock.ev.on("messaging-history.set", ({ messages, syncType, isLatest }) => {
    const stories = (messages || []).filter(m => {
      const x = m?.message || {};
      return !!(x.groupStatusMessage || x.groupStatusMessageV2);
    });

    console.log("📚 HISTORY SYNC:", {
      messages: messages?.length || 0,
      stories: stories.length,
      syncType,
      isLatest
    });

    for (const m of stories.slice(0, 10)) {
      console.log("📌 HISTORY GROUP STORY:", JSON.stringify({
        remoteJid: m?.key?.remoteJid,
        id: m?.key?.id,
        participant: m?.key?.participant,
        participantAlt: m?.key?.participantAlt
      }, null, 2));
    }
  });
  registerGroupFeatureEvents(sock);


  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "connecting") {
      status = "CONNECTING";
      console.log("📡 Connecting...");
    }

    if (connection === "open") {
      restarting = false;
      console.log("✅ —͟͞͞𝗔ʀᴀꜰᴀᴛㅤBbz ᥫ᭡፝֟ CONNECTED!");
    }

    if (connection === "close") {
      status = "DISCONNECTED";

      const code =
        lastDisconnect?.error?.output?.statusCode;

      console.log("⚠️ Connection closed:", code || "unknown");

      if (
        code !== DisconnectReason.loggedOut &&
        !restarting
      ) {
        restarting = true;

        console.log(
          "🔄 Reconnecting in 3 seconds..."
        );

        setTimeout(() => {
          startWhatsApp().catch((err) => {
            restarting = false;
            status = "ERROR";
            console.log(
              "❌ Restart error:",
              err.message
            );
          });
        }, 3000);
      }
    }
  });

  /* =========================
     MESSAGE HANDLER
  ========================= */

  sock.ev.on("group-participants.update", async (update) => {
  try {
    if (!update?.id || update.action !== "add") return;

    const count = Array.isArray(update.participants)
      ? update.participants.length
      : 0;

    if (!count) return;

    // AntiBot: only removes accounts explicitly marked as bots.
    const botProtection = protection.get(update.id);

    if (
      botProtection.antibot &&
      Array.isArray(update.participants)
    ) {
      for (const participant of update.participants) {
        const target =
          participant?.id ||
          participant?.phoneNumber ||
          participant?.lid;

        if (!target) continue;

        if (protection.isKnownBot(update.id, target)) {
          try {
            await sock.sendMessage(update.id, {
              text:
                "⚠️ 𝗔𝗡𝗧𝗜𝗕𝗢𝗧 𝗗𝗘𝗧𝗘𝗖𝗧𝗘𝗗\n\n" +
                `🤖 Marked bot detected: ${target}\n` +
                "🚫 Member will be removed by protection."
            });

            await sock.groupParticipantsUpdate(
              update.id,
              [target],
              "remove"
            );

            console.log(
              `🤖 ARAFAT ANTIBOT | REMOVED | ${target} | ${update.id}`
            );
          } catch (e) {
            console.log(
              "⚠️ AntiBot remove error:",
              e.message
            );
          }
        }
      }
    }

    const result = joinShield.check(update.id, count);

    if (result.suspicious) {
      console.log(
        `🛡️ ARAFAT SHIELD | JOIN_BURST | ${update.id} | ${result.count} joins/30s`
      );
    }
  } catch (e) {
    console.log("❌ Shield join error:", e.message);
  }
});




// 😂 GROUP STORY AUTO DELETE
sock.ev.on("messages.reaction", async (items) => {
  try {
    for (const item of items || []) {
      const reaction = item?.reaction;

      // আসল reacted message-এর key
      const targetKey = reaction?.key;

      const emoji = reaction?.text || "";
      const jid = targetKey?.remoteJid || "";

      if (emoji !== "😂") continue;
      if (!jid.endsWith("@g.us")) continue;

      console.log("🔥 GROUP STORY 😂 REACTION DETECTED");
      console.log("🎯 TARGET:", jid, targetKey?.id);

      try {
        await sock.sendMessage(jid, {
          delete: targetKey
        });

        console.log("🗑️ GROUP STORY DELETE SENT:", targetKey?.id);
      } catch (e) {
        console.log("❌ GROUP STORY DELETE FAILED:", e.message);
      }
    }
  } catch (e) {
    console.log("❌ Story reaction handler:", e.message);
  }
});

sock.ev.on("messages.upsert", async ({ messages, type }) => {
  for (const x of messages || []) {
    const m = x?.message || {};

    if (
      (m.groupStatusMessage || m.groupStatusMessageV2) &&
      x?.key?.remoteJid?.endsWith("@g.us")
    ) {
      console.log("🚨 DIRECT GROUP STORY EVENT RECEIVED");
      console.log(JSON.stringify({
        remoteJid: x.key.remoteJid,
        id: x.key.id,
        participant: x.key.participant,
        participantAlt: x.key.participantAlt,
        fromMe: x.key.fromMe,
        messageType: Object.keys(m)
      }, null, 2));
    }
  }
 console.log("📩 MESSAGE EVENT RECEIVED:", messages?.length || 0, "TYPE:", type);
    try {
    // Message debug logs disabled

for (const x of messages || []) {
  const m = x?.message || {};
  if (m.groupStatusMessage || m.groupStatusMessageV2) {
    console.log("🔥 GROUP STATUS DETECTED");
    console.log(JSON.stringify({
      key: x?.key,
      groupStatusMessage: !!m.groupStatusMessage,
      groupStatusMessageV2: !!m.groupStatusMessageV2
    }, null, 2));
  }
}
      console.log("🔔 EVENT TYPE CHECK:", type, "MESSAGES:", messages?.length || 0);

      if (type !== "notify" && type !== "append") {
        console.log("⏭️ EVENT SKIPPED:", type);
        return;
      }

    if (!Array.isArray(messages) || messages.length === 0) return;
    console.log("🟢 LIVE EVENT:", type, messages.length);

      for (const msg of messages) {
      const ext = msg.message?.extendedTextMessage;
      const ctx = ext?.contextInfo;
      const quoted = ctx?.quotedMessage;
      const storyJid = msg.key?.remoteJid || "";

      // =========================
      // REAL-TIME GROUP STORY AUTO DELETE
      // =========================
      try {
        const liveStory =
          msg.message?.groupStatusMessage ||
          msg.message?.groupStatusMessageV2;

        if (liveStory && storyJid.endsWith("@g.us")) {
          console.log("🚨 REAL-TIME GROUP STORY DETECTED");

          const body = liveStory?.message || {};

          const storyContext =
            body?.videoMessage?.contextInfo ||
            body?.imageMessage?.contextInfo ||
            body?.extendedTextMessage?.contextInfo ||
            body?.audioMessage?.contextInfo ||
            {};

          const author =
            storyContext?.statusAttributions?.find(
              x => x?.type === "GROUP_STATUS"
            )?.groupStatus?.authorJid ||
            msg.key?.participant ||
            msg.key?.participantAlt ||
            "";

          const storyKey = {
            remoteJid: storyJid,
            fromMe: !!msg.key?.fromMe,
            id: msg.key?.id,
            participant: author
          };

          console.log(
            "🎯 REAL-TIME STORY KEY:",
            JSON.stringify(storyKey, null, 2)
          );

          if (storyKey.id && author) {
            statusStore.add(storyJid, storyKey);

            try {
              await sock.sendMessage(storyJid, {
                delete: storyKey
              });

              console.log(
                "🗑️ REAL-TIME GROUP STORY DELETE REQUEST SENT"
              );
            } catch (e) {
              console.log(
                "❌ REAL-TIME GROUP STORY DELETE FAILED:",
                e.message
              );
            }

            try {
              await sock.sendMessage(storyJid, {
                text:
                  "⚠️ 𝗔𝗡𝗧𝗜𝗦𝗧𝗔𝗧𝗨𝗦 𝗪𝗔𝗥𝗡𝗜𝗡𝗚\\n\\n" +
                  "🚫 Group Story এই গ্রুপে অনুমোদিত নয়.\\n" +
                  "🗑️ Story removal request sent."
              });

              console.log(
                "⚠️ REAL-TIME GROUP STORY WARNING SENT"
              );
            } catch (e) {
              console.log(
                "❌ REAL-TIME GROUP STORY WARNING ERROR:",
                e.message
              );
            }
          } else {
            console.log(
              "❌ REAL-TIME STORY SKIPPED: missing story id/author"
            );
          }
        }
      } catch (e) {
        console.log(
          "❌ REAL-TIME GROUP STORY ERROR:",
          e.message
        );
      }

      // =========================
      // GROUP STORY REACTION / DELETE
      // =========================
      if (
        ext?.text?.trim() === "😂" &&
        quoted?.groupStatusMessageV2 &&
        storyJid.endsWith("@g.us")
      ) {
        console.log("🔥 GROUP STORY 😂 DETECTED");

        try {
          const statusBody =
            quoted.groupStatusMessageV2?.message || {};

          const statusContext =
            statusBody?.videoMessage?.contextInfo ||
            statusBody?.imageMessage?.contextInfo ||
            statusBody?.extendedTextMessage?.contextInfo ||
            statusBody?.audioMessage?.contextInfo ||
            {};

          const author =
            statusContext?.statusAttributions?.find(
              x => x?.type === "GROUP_STATUS"
            )?.groupStatus?.authorJid ||
            ctx?.participant ||
            "";

          const storyId = ctx?.stanzaId;

          const storyKey = {
            remoteJid: storyJid,
            fromMe: false,
            id: storyId,
            participant: author
          };

          if (storyId && author) {
            statusStore.add(storyJid, storyKey);
            console.log("💾 GROUP STORY TRACKED:", storyId);
          }

          console.log(
            "🎯 GROUP STORY DELETE KEY:",
            JSON.stringify(storyKey, null, 2)
          );
          console.log("🧩 STORY ID:", storyId);
          console.log("🧩 STORY AUTHOR:", author);
          console.log("🧩 STORY JID:", storyJid);

          if (!storyId || !author) {
            console.log(
              "❌ GROUP STORY DELETE SKIPPED: missing storyId/author"
            );
          } else {
            try {
              await sock.sendMessage(storyJid, {
                delete: storyKey
              });

              console.log(
                "✅ GROUP STORY DELETE REQUEST SENT"
              );
            } catch (e) {
              console.log(
                "❌ GROUP STORY DELETE FAILED:",
                e.message
              );
            }

            try {
              await sock.sendMessage(storyJid, {
                text:
                  "⚠️ 𝗔𝗡𝗧𝗜𝗦𝗧𝗔𝗧𝗨𝗦 𝗪𝗔𝗥𝗡𝗜𝗡𝗚\n\n" +
                  "🚫 Group Story এই গ্রুপে অনুমোদিত নয়.\n" +
                  "🗑️ Story removal request sent."
              });

              console.log(
                "✅ GROUP STORY WARNING SENT"
              );
            } catch (e) {
              console.log(
                "❌ GROUP STORY WARNING ERROR:",
                e.message
              );
            }
          }
        } catch (e) {
          console.log(
            "❌ GROUP STORY MODERATION ERROR:",
            e.message
          );
        }
      }

        // =========================
    // GROUP STATUS PROTECTION
    // =========================
    try {
      if (await statusProtection.handle(sock, msg)) {
        console.log("🛡️ ANTISTATUS: GROUP STATUS REMOVED");
        continue;
      }
    } catch (e) {
      console.log("❌ ANTISTATUS HANDLER:", e.message);
    }

    if (!msg) continue;

        // Ignore WhatsApp newsletter/channel events
        const msgJid = msg.key?.remoteJid || "";
        if (msgJid.endsWith("@newsletter")) continue;

        console.log("🟡 PROCESSING MESSAGE:", msg.key?.remoteJid, msg.key?.id);
        console.log("🧩 MESSAGE KEYS:", Object.keys(msg.message || {}));
      if (msg.message?.protocolMessage) {
        console.log(
          "🔬 PROTOCOL DEBUG:",
          JSON.stringify(msg.message.protocolMessage, null, 2)
        );
      }
        console.log("🧩 STUB:", msg.messageStubType || "none", msg.messageStubParameters || []);

      try {
        await smartReply.handle(sock, msg);
      } catch (e) {
        console.log("⚠️ Smart Reply:", e.message);
      }

      console.log("🟢 SMART REPLY DONE:", msg.key?.id);

      const debugText =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        "";

      console.log("🔎 MESSAGE TEXT:", JSON.stringify(debugText));
      if (debugText === "😂") {
        console.log("🔍 😂 MESSAGE KEY:");
        console.log(JSON.stringify(msg.key, null, 2));

        console.log("🔍 😂 MESSAGE CONTEXT:");
        console.log(JSON.stringify(
          msg.message?.extendedTextMessage?.contextInfo ||
          msg.message?.messageContextInfo ||
          {},
          null,
          2
        ));
      }

      if (debugText === "😂") {
        console.log(
          "🔍 STORY REPLY RAW:",
          JSON.stringify({
            key: msg.key,
            message: msg.message
          }, null, 2)
        );
      }

      const jid = msg.key.remoteJid;

      if (!jid || jid === "status@broadcast") return;

      // =========================
      // ANTISTICKER
      // =========================
      const isSticker = !!msg.message?.stickerMessage;

      if (isSticker && jid?.endsWith("@g.us")) {
        try {
          const saved = protection.get(jid);

          if (saved?.antisticker) {
            await sock.sendMessage(jid, {
              delete: msg.key
            });

            console.log("🗑️ ANTISTICKER DELETE:", msg.key?.id);

            await sock.sendMessage(jid, {
              text:
                "⚠️ 𝗔𝗡𝗧𝗜𝗦𝗧𝗜𝗖𝗞𝗘𝗥 𝗪𝗔𝗥𝗡𝗜𝗡𝗚\n\n" +
                "🎟️ Sticker detected and deleted.\n" +
                "🚫 Please do not send stickers here."
            });

            console.log("⚠️ ANTISTICKER WARNING SENT");
          }
        } catch (e) {
          console.log("❌ ANTISTICKER ERROR:", e.message);
        }
      }

      // =========================
      // ANTILINK
      // =========================
      if (jid?.endsWith("@g.us")) {
        try {
          const saved = protection.get(jid);

          if (saved?.antilink && !msg.key?.fromMe) {
            const body =
              msg.message?.conversation ||
              msg.message?.extendedTextMessage?.text ||
              msg.message?.imageMessage?.caption ||
              msg.message?.videoMessage?.caption ||
              "";

            const hasLink =
              /(?:https?:\/\/|www\.|wa\.me\/|chat\.whatsapp\.com\/)/i.test(body);

            if (hasLink) {
              await sock.sendMessage(jid, {
                delete: msg.key
              });

              console.log("🔗 ANTILINK DELETE:", msg.key?.id);

              await sock.sendMessage(jid, {
                text:
                  "⚠️ 𝗔𝗡𝗧𝗜𝗟𝗜𝗡𝗞 𝗪𝗔𝗥𝗡𝗜𝗡𝗚\n\n" +
                  "🔗 Link detected and deleted.\n" +
                  "🚫 Please do not send links in this group."
              });

              console.log("⚠️ ANTILINK WARNING SENT");
              return;
            }
          }
        } catch (e) {
          console.log("❌ ANTILINK ERROR:", e.message);
        }
      }

      const text =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        msg.message?.videoMessage?.caption ||
        "";

      const command = text.trim().toLowerCase();

    if (command.startsWith(".")) {
      const cmdName = command.slice(1).split(/\s+/)[0];
      const args = command.slice(1).trim().split(/\s+/).slice(1);
      const cmd = commands.get(cmdName);

      // PUBLIC / PRIVATE MODE
      global.arafatMode = global.arafatMode || "public";
      const ownerNumber = "8801890492613";
      const senderJid = msg.key.participant || msg.key.remoteJid || "";
      const senderNumber = senderJid.split("@")[0].split(":")[0];
      const isOwner = msg.key.fromMe || senderNumber === ownerNumber;

      // .mode command: owner only
      if (cmdName === "mode") {
        if (!isOwner) {
          await sock.sendMessage(jid, {
            text: "❌ এই command শুধু Bot Owner ব্যবহার করতে পারবে।"
          });
          return;
        }

        const requestedMode = args[0]?.toLowerCase();

        if (!["public", "private"].includes(requestedMode)) {
          await sock.sendMessage(jid, {
            text: `⚙️ Usage: .mode public / .mode private

Current Mode : ${global.arafatMode.toUpperCase()}`
          });
          return;
        }

        global.arafatMode = requestedMode;

        await sock.sendMessage(jid, {
          text: `╭━━━〔 ⚙️ 𝗕𝗢𝗧 𝗠𝗢𝗗𝗘 〕━━━╮
┃
┃ ✅ Mode : ${requestedMode.toUpperCase()}
┃ 👑 Changed by : Owner
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        });
        return;
      }

      // PRIVATE mode: only owner can use commands
      if (global.arafatMode === "private" && !isOwner) {
        return;
      }

      console.log("🧪 COMMAND LOOKUP:", cmdName, "FOUND:", !!cmd, "JID:", jid);

      if (cmd) {
        console.log("🚀 EXECUTING COMMAND:", cmdName);
        try {
          await sock.sendMessage(jid, { react: { text: "⚡", key: msg.key } });
        } catch (e) {}
        await cmd.execute(sock, msg, args);
        return;
      }
    }

      /* .shock */

      else if (command === ".shock") {
        await sock.sendMessage(jid, {
          text:
`⚡ SYSTEM SCAN STARTED...

🔍 Checking system...
🔍 Checking network...
🔍 Checking files...

████████████████ 100%

😈 PRANK COMPLETE 😂

কোনো আসল scan হয়নি।
এটা শুধু —͟͞͞𝗔ʀᴀꜰᴀᴛㅤBbz ᥫ᭡፝֟-এর fake prank. 🤖`
        });
      }

      }
    } catch (error) {
      console.log(
        "❌ Message error:",
        error.message
      );
    }
  });
}

/* =========================
   WEB PANEL
========================= */

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport"
content="width=device-width,initial-scale=1">

<title>—͟͞͞𝗔ʀᴀꜰᴀᴛㅤBbz ᥫ᭡፝֟</title>

<style>
*{box-sizing:border-box}

body{
  margin:0;
  min-height:100vh;
  background:radial-gradient(
    circle at top,
    #172554,
    #020617 65%
  );
  color:white;
  font-family:Arial,sans-serif;
  display:flex;
  align-items:center;
  justify-content:center;
}

.panel{
  width:92%;
  max-width:460px;
  padding:30px;
  border-radius:25px;
  background:rgba(15,23,42,.94);
  border:1px solid rgba(255,255,255,.12);
  box-shadow:0 25px 80px rgba(0,0,0,.6);
}

.logo{
  text-align:center;
  font-size:31px;
  font-weight:800;
}

.sub{
  text-align:center;
  color:#94a3b8;
  margin-top:7px;
  margin-bottom:30px;
}

.statusBox{
  margin-top:22px;
  padding:17px;
  border-radius:15px;
  background:#020617;
  border:1px solid #1e293b;
}

.statusTitle{
  color:#94a3b8;
}

#status{
  font-weight:bold;
  margin-top:6px;
}

.code{
  margin-top:18px;
  text-align:center;
  font-size:30px;
  font-weight:800;
  letter-spacing:6px;
  color:#60a5fa;
}

.help{
  margin-top:15px;
  text-align:center;
  color:#64748b;
  font-size:12px;
}
</style>
</head>

<body>

<div class="panel">

<div class="logo">
🤖 —͟͞͞𝗔ʀᴀꜰᴀᴛㅤBbz ᥫ᭡፝֟
</div>

<div class="sub">
WhatsApp Bot Control Panel
</div>

<div class="statusBox">

<div class="statusTitle">
Connection Status
</div>

<div id="status">
Checking...
</div>

<div id="code" class="code"></div>

</div>

<div class="help">
—͟͞͞𝗔ʀᴀꜰᴀᴛㅤBbz ᥫ᭡፝֟ • WhatsApp
</div>

</div>

<script>

async function updateStatus(){

try{

const response =
await fetch("/status");

const data =
await response.json();

document.getElementById("status")
.innerText = data.status;

}catch(e){

document.getElementById("status")
.innerText =
"SERVER OFFLINE";

}

}

setInterval(updateStatus,2000);
updateStatus();

</script>

</body>
</html>
  `);
});

/* =========================
   STATUS API
========================= */


app.post("/api/pair", async (req, res) => {
  try {
    const { slot = "1", phone } = req.body || {};

    const number = String(phone || "").replace(/\D/g, "");

    if (!number) {
      return res.status(400).json({
        ok: false,
        error: "Phone number required"
      });
    }

    const {
      startSession,
      requestPairingCode
    } = require("./lib/sessionConnector");

    await startSession(String(slot));

    const code = await requestPairingCode(
      String(slot),
      number
    );

    res.json({
      ok: true,
      slot: String(slot),
      code
    });

  } catch (error) {
    console.log("❌ PAIR API:", error.message);

    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

app.get("/status", (req, res) => {
  let sessionStats = {
    max: 50,
    used: 0,
    active: 0,
    connecting: 0,
    empty: 50
  };

  try {
    const sessionManager = require("./lib/sessionManager");
    sessionStats = sessionManager.stats();
  } catch (e) {
    console.log("⚠️ Session stats:", e.message);
  }

  res.json({
    status,
    code: pairingCode,
    sessions: sessionStats
  });
});

/* =========================
   SERVER
========================= */

app.listen(PORT, () => {

  console.log(`
╔══════════════════════════════╗
║        🤖 —͟͞͞𝗔ʀᴀꜰᴀᴛㅤBbz ᥫ᭡፝֟        ║
║       WEB PANEL ONLINE      ║
╚══════════════════════════════╝

🌐 http://127.0.0.1:${PORT}

`);

  startWhatsApp().catch((error) => {

    status = "ERROR";

    console.log(
      "❌ WhatsApp startup error:",
      error.message
    );

  });

});
