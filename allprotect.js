const protection = require("../lib/protection");

module.exports = {
  name: "allprotect",
  aliases: ["allprotection", "protectall"],
  category: "Protection",
  description: "Enable or disable protection for all groups",

  async execute(sock, msg, args) {
    const jid = msg.key?.remoteJid || "";

    // Only private chat / inbox
    if (jid.endsWith("@g.us")) {
      return sock.sendMessage(jid, {
        text: "❌ এই command Group-এর ভিতর থেকে ব্যবহার করা যাবে না।\n\n📩 Bot-এর Inbox থেকে ব্যবহার করুন।"
      });
    }

    // Owner only
    const ownerNumber = "8801890492613";
    const senderJid =
      msg.key?.participant ||
      msg.key?.remoteJid ||
      "";

    const senderNumber =
      senderJid
        .split("@")[0]
        .split(":")[0];

    const isOwner =
      msg.key?.fromMe ||
      senderNumber === ownerNumber;

    if (!isOwner) {
      return sock.sendMessage(jid, {
        text: "❌ এই command শুধু Bot Owner ব্যবহার করতে পারবে।"
      });
    }

    const action = (args[0] || "").toLowerCase();

    if (!["on", "off"].includes(action)) {
      return sock.sendMessage(jid, {
        text:
          "⚙️ Usage:\n\n" +
          ".allprotect on\n" +
          ".allprotect off"
      });
    }

    try {
      const groups = await sock.groupFetchAllParticipating();
      const groupList = Object.values(groups || {});

      if (!groupList.length) {
        return sock.sendMessage(jid, {
          text: "⚠️ Bot কোনো participating group খুঁজে পায়নি।"
        });
      }

      let success = 0;
      let failed = 0;

      for (const group of groupList) {
        const groupJid = group?.id;

        if (!groupJid || !groupJid.endsWith("@g.us")) {
          continue;
        }

        try {
          if (action === "on") {
            protection.set(groupJid, "antiflood", true);
            protection.set(groupJid, "antiraid", true);
            protection.set(groupJid, "antibadword", true);
            protection.set(groupJid, "antibot", true);

            protection.set(groupJid, "antilink", true);
            protection.set(groupJid, "antilinkMode", "all");

            protection.set(groupJid, "antisticker", true);
            protection.set(groupJid, "antistickerMode", "all");

            protection.set(groupJid, "antistatus", true);
          } else {
            protection.set(groupJid, "antiflood", false);
            protection.set(groupJid, "antiraid", false);
            protection.set(groupJid, "antibadword", false);
            protection.set(groupJid, "antibot", false);

            protection.set(groupJid, "antilink", false);
            protection.set(groupJid, "antisticker", false);
            protection.set(groupJid, "antistatus", false);
          }

          success++;
        } catch (e) {
          failed++;
          console.log(
            "❌ ALLPROTECT GROUP ERROR:",
            groupJid,
            e.message
          );
        }
      }

      const status =
        action === "on"
          ? "🟢 ALL PROTECTION ON"
          : "🔴 ALL PROTECTION OFF";

      await sock.sendMessage(jid, {
        text:
          `╭━━━〔 🛡️ 𝗔𝗥𝗔𝗙𝗔𝗧 𝗣𝗥𝗢𝗧𝗘𝗖𝗧 ━━━╮
┃
┃ ${status}
┃
┃ 👥 Total Groups : ${groupList.length}
┃ ✅ Updated       : ${success}
┃ ❌ Failed        : ${failed}
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`
      });

      console.log(
        `🛡️ ALLPROTECT ${action.toUpperCase()} | TOTAL: ${groupList.length} | SUCCESS: ${success} | FAILED: ${failed}`
      );

    } catch (e) {
      console.log("❌ ALLPROTECT ERROR:", e.message);

      await sock.sendMessage(jid, {
        text:
          "❌ All Protection update করা যায়নি.\n\n" +
          `Error: ${e.message}`
      });
    }
  }
};
