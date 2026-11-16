const protection = require("../lib/protection");

module.exports = {
  name: "antisticker",
  aliases: ["antistickeron"],
  category: "Group",
  description: "Persistent sticker protection",

  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    if (!jid?.endsWith("@g.us")) {
      return sock.sendMessage(jid, { text: "❌ Group only." });
    }

    const mode = (args[0] || "all").toLowerCase();
    const valid = ["member", "admin", "all", "off"];

    if (!valid.includes(mode)) {
      return sock.sendMessage(jid, {
        text: "⚙️ Usage: .antisticker member/admin/all/off"
      });
    }

    if (mode === "off") {
      protection.set(jid, "antisticker", false);

      return sock.sendMessage(jid, {
        text: "🛡️ 𝗔𝗡𝗧𝗜𝗦𝗧𝗜𝗖𝗞𝗘𝗥\n\n🔴 Protection: OFF"
      });
    }

    protection.set(jid, "antisticker", true);
    protection.set(jid, "antistickerMode", mode);

    await sock.sendMessage(jid, {
      text:
        "🛡️ 𝗔𝗡𝗧𝗜𝗦𝗧𝗜𝗖𝗞𝗘𝗥\n\n" +
        "🟢 Protection: ON\n" +
        "🎯 Target: " + mode.toUpperCase() + "\n" +
        "💾 Saved permanently"
    });
  }
};
