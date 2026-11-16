module.exports = {
  name: "timezone",
  aliases: ["tz"],
  category: "Utility",
  description: "Show Bangladesh timezone",

  async execute(sock, msg) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: `🌍 ᴛɪᴍᴇᴢᴏɴᴇ\n\n➤ ᴄᴏᴜɴᴛʀʏ : ʙᴀɴɢʟᴀᴅᴇsʜ\n➤ ᴛɪᴍᴇᴢᴏɴᴇ : ᴀsɪᴀ/ᴅʜᴀᴋᴀ\n➤ ᴜᴛᴄ : +𝟶𝟼:𝟶𝟶`
    });
  }
};
