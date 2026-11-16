module.exports = {
  name: "test",
  aliases: ["t"],
  category: "Tools",
  description: "Test command loader",

  async execute(sock, msg) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: `╭━━━〔 —͟͞͞𝗔ʀᴀꜰᴀᴛㅤBbz ᥫ᭡፝֟ 〕━━━╮
┃
┃  ✅ ᴄᴏᴍᴍᴀɴᴅ ʟᴏᴀᴅᴇʀ : ᴏɴʟɪɴᴇ
┃  📦 ᴍᴏᴅᴜʟᴇ sʏsᴛᴇᴍ : ʀᴇᴀᴅʏ
┃  ⚡ sᴛᴀᴛᴜs : ᴡᴏʀᴋɪɴɢ
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯`
    });
  }
};
