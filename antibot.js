const antiBot = require("../lib/antiBot");

module.exports = {
  name: "antibot",
  aliases: ["ab"],
  category: "GROUP",
  description: "Turn AntiBot ON or OFF",

  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    if (!jid?.endsWith("@g.us")) {
      return sock.sendMessage(jid, {
        text: "❌ এই command শুধু group-এ ব্যবহার করা যাবে।"
      });
    }

    const action = (args[0] || "").toLowerCase();

    if (!["on", "off", "status"].includes(action)) {
      return sock.sendMessage(jid, {
        text:
          "╭┈───〔 ANTI-BOT 〕┈───⊷\n" +
          "├✦ .antibot on\n" +
          "├✦ .antibot off\n" +
          "├✦ .antibot status\n" +
          "╰───────────────────⊷"
      });
    }

    if (action === "status") {
      return sock.sendMessage(jid, {
        text: `🛡️ AntiBot: ${antiBot.isEnabled() ? "ON ✅" : "OFF ❌"}`
      });
    }

    antiBot.setEnabled(action === "on");

    await sock.sendMessage(jid, {
      text:
        action === "on"
          ? "🛡️ AntiBot এখন ON ✅"
          : "🛡️ AntiBot এখন OFF ❌"
    });
  }
};
