const protection = require("../lib/protection");

module.exports = {
  name: "antibadword",
  aliases: ["badwordguard"],
  category: "Protection",
  description: "Toggle badword protection",

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
        text: "Usage:\n.antibadword on\n.antibadword off"
      });
    }

    protection.set(jid, "antibadword", mode === "on");

    await sock.sendMessage(jid, {
      text: mode === "on"
        ? "🚫 AntiBadword ✅ ON"
        : "🚫 AntiBadword 🔴 OFF"
    });
  }
};
