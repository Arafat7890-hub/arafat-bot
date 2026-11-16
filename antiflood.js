const protection = require("../lib/protection");

module.exports = {
  name: "antiflood",
  aliases: ["floodguard"],
  category: "Protection",
  description: "Toggle anti flood protection",

  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    if (!jid?.endsWith("@g.us")) {
      return sock.sendMessage(jid, { text: "❌ Group only." });
    }

    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || jid;
    const myId = sock.user?.id || "";
    const myLid = sock.user?.lid || "";

    const normalize = (id) =>
      String(id || "").split(":")[0].toLowerCase();

    const senderInfo = meta.participants.find(x =>
      normalize(x.id) === normalize(sender) ||
      normalize(x.phoneNumber) === normalize(sender) ||
      normalize(x.lid) === normalize(sender)
    );

    const botInfo = meta.participants.find(x =>
      normalize(x.id) === normalize(myId) ||
      normalize(x.id) === normalize(myLid) ||
      normalize(x.phoneNumber) === normalize(myId) ||
      normalize(x.phoneNumber) === normalize(myLid) ||
      normalize(x.lid) === normalize(myId) ||
      normalize(x.lid) === normalize(myLid)
    );

    const admin = senderInfo?.admin;
    const botAdmin = botInfo?.admin;

    console.log("🔎 BOT ADMIN DEBUG:", {
      sockUserId: myId,
      sockUserLid: myLid,
      matchedBotId: botInfo?.id,
      matchedBotPhone: botInfo?.phoneNumber,
      matchedBotLid: botInfo?.lid,
      botAdmin
    });

    if (!admin) {
      return sock.sendMessage(jid, { text: "❌ শুধু Admin ব্যবহার করতে পারবে।" });
    }

    if (!botAdmin) {
      return sock.sendMessage(jid, { text: "❌ Bot-কে আগে Admin করতে হবে।" });
    }

    const mode = (args[0] || "").toLowerCase();

    if (!["on", "off"].includes(mode)) {
      return sock.sendMessage(jid, {
        text: "Usage:\n.antiflood on\n.antiflood off"
      });
    }

    protection.set(jid, "antiflood", mode === "on");

    await sock.sendMessage(jid, {
      text: mode === "on"
        ? "🛡️ AntiFlood ✅ ON\n\nঅতিরিক্ত message burst detect হবে এবং admin alert পাবে।"
        : "🛡️ AntiFlood 🔴 OFF"
    });
  }
};
