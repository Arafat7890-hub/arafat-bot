const protection = require("../lib/protection");

module.exports = {
  name: "antilink",
  aliases: ["antilinkon"],
  category: "Group",
  description: "Persistent link protection",

  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    if (!jid?.endsWith("@g.us")) {
      return sock.sendMessage(jid, { text: "❌ Group only." });
    }

    const mode = (args[0] || "all").toLowerCase();
    const valid = ["member", "admin", "all", "off"];

    if (!valid.includes(mode)) {
      return sock.sendMessage(jid, {
        text: "⚙️ Usage: .antilink member/admin/all/off"
      });
    }

    if (mode === "off") {
      protection.set(jid, "antilink", false);

      return sock.sendMessage(jid, {
        text: "🔗 𝗔𝗡𝗧𝗜𝗟𝗜𝗡𝗞\n\n🔴 Protection: OFF"
      });
    }

    protection.set(jid, "antilink", true);
    protection.set(jid, "antilinkMode", mode);

    await sock.sendMessage(jid, {
      text:
        "🔗 𝗔𝗡𝗧𝗜𝗟𝗜𝗡𝗞\n\n" +
        "🟢 Protection: ON\n" +
        "🎯 Target: " + mode.toUpperCase() + "\n" +
        "💾 Saved permanently"
    });
  }
};
