const os = require("os");

module.exports = {
  name: "botinfo",
  aliases: ["about", "info"],
  category: "System",
  description: "Bot information dashboard",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);

    const mem = process.memoryUsage().rss / 1024 / 1024;

    const text =
`╭──〔 —͟͞͞𝗔ʀᴀꜰᴀᴛㅤBbz ᥫ᭡፝֟ 〕──╮
│
├─ 𝗩ᴇʀsɪᴏɴ    : 1.0.0
├─ 𝗣ʀᴇғɪx     : .
├─ 𝗠ᴏᴅᴇ      : ${global.arafatMode || "public"}
├─ 𝗨ᴘᴛɪᴍᴇ     : ${h}h ${m}m ${s}s
├─ 𝗠ᴇᴍᴏʀʏ     : ${mem.toFixed(1)} MB
├─ 𝗡ᴏᴅᴇ       : ${process.version}
├─ 𝗣ʟᴀᴛғᴏʀᴍ   : ${os.platform()}
│
╰────────────────────────────╯`;

    return sock.sendMessage(jid, { text });
  }
};
