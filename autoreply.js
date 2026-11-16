const smartReply = require("../lib/smartReply");

module.exports = {
  name: "autoreply",
  aliases: ["ar", "smartreply"],
  category: "AI",
  description: "Turn automatic reply ON or OFF",

  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const action = (args[0] || "").toLowerCase();

    if (!["on", "off", "status"].includes(action)) {
      return sock.sendMessage(jid, {
        text:
`╭──〔 𝗔𝗨𝗧𝗢 𝗥𝗘𝗣𝗟𝗬 〕──╮
│
├─ .autoreply on
├─ .autoreply off
├─ .autoreply status
│
╰──────────────────────╯`
      });
    }

    if (action === "status") {
      return sock.sendMessage(jid, {
        text: `🤖 Auto Reply: ${smartReply.isEnabled() ? "ON 🟢" : "OFF 🔴"}`
      });
    }

    smartReply.setEnabled(action === "on");

    return sock.sendMessage(jid, {
      text: `🤖 Auto Reply: ${action === "on" ? "ON 🟢" : "OFF 🔴"}`
    });
  }
};
