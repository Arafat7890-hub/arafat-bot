const sessionManager = require("../lib/sessionManager");

module.exports = {
  name: "sessions",
  aliases: ["session", "slots"],
  category: "System",
  description: "Multi-session dashboard",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    const stats = sessionManager.stats();
    const slots = sessionManager.listSlots();

    const active = slots.filter(x => x.status === "connected");
    const connecting = slots.filter(x => x.status === "connecting");
    const loggedOut = slots.filter(x => x.status === "logged_out");

    const text =
`╭──〔 𝗔𝗥𝗔𝗙𝗔𝗧 𝗦𝗘𝗦𝗦𝗜𝗢𝗡𝗦 〕──╮
│
├─ 𝗠ᴀx 𝗦ʟᴏᴛs  : ${stats.max}
├─ 𝗨sᴇᴅ       : ${stats.used}
├─ 𝗔ᴄᴛɪᴠᴇ     : ${stats.active}
├─ 𝗖ᴏɴɴᴇᴄᴛɪɴɢ : ${stats.connecting}
├─ 𝗘ᴍᴘᴛʏ      : ${stats.empty}
│
├─ 𝗖ᴏɴɴᴇᴄᴛᴇᴅ : ${active.map(x => x.id).join(", ") || "None"}
├─ 𝗟ᴏɢɢɪɴɢ    : ${connecting.map(x => x.id).join(", ") || "None"}
├─ 𝗟ᴏɢɢᴇᴅ 𝗢ᴜᴛ: ${loggedOut.map(x => x.id).join(", ") || "None"}
│
╰────────────────────────────╯`;

    return sock.sendMessage(jid, { text });
  }
};
