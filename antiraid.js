const protection = require("../lib/protection");

module.exports = {
  name: "antiraid",
  aliases: ["joinshield"],
  category: "Protection",
  description: "Toggle join burst protection",

  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    if (!jid?.endsWith("@g.us")) {
      return sock.sendMessage(jid, { text: "❌ Group only." });
    }

    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || jid;

    if (!meta.participants.find(x => x.id === sender)?.admin) {
      return sock.sendMessage(jid, {
        text: "❌ শুধু Group Admin ব্যবহার করতে পারবে।"
      });
    }

    const mode = (args[0] || "").toLowerCase();

    if (!["on", "off"].includes(mode)) {
      return sock.sendMessage(jid, {
        text: "Usage:\n.antiraid on\n.antiraid off"
      });
    }

    protection.set(jid, "antiraid", mode === "on");

    await sock.sendMessage(jid, {
      text: mode === "on"
        ? "🚨 AntiRaid ✅ ON\n\nঅস্বাভাবিক join burst detect হলে admin alert হবে।"
        : "🚨 AntiRaid 🔴 OFF"
    });
  }
};
