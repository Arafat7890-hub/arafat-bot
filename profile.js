module.exports = {
  name: "profile",
  aliases: ["intro", "aboutme"],
  category: "Utility",
  description: "Show developer introduction",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    const text = `╭━━━〔 👤 ᴘʀᴏғɪʟᴇ 〕━━━╮
┃
┃ 👤 ɴᴀᴍᴇ : —͞Aʀᴀғᴀᴛ !¡ 🕊️
┃ 🎂 ᴀɢᴇ : 𝟸𝟹
┃ 🎓 sᴛᴜᴅʏ : ʜᴏɴᴏᴜʀs 𝟹ʀᴅ ʏᴇᴀʀ
┃ 📍 ᴀᴅᴅʀᴇss : ᴄʜᴀᴛᴛᴏɢʀᴀᴍ
┃ 💻 ʜᴏʙʙʏ : ᴄᴏᴅɪɴɢ & ᴛᴇᴄʜ
┃ 🐧 ɪɴᴛᴇʀᴇsᴛ : ʟɪɴᴜx & ᴇᴛʜɪᴄᴀʟ ᴛᴇᴄʜ
┃
╰━━━━━━━━━━━━━━━━━━━━╯

— ᴅᴇᴠᴇʟᴏᴘᴇᴅ ʙʏ 𝙈𝙧. 𝘼𝙧𝙖𝙛𝙖𝙩 —`;

    await sock.sendMessage(jid, { text });
  }
};
