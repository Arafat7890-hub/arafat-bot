module.exports = {
  name: "timestamp",
  aliases: ["ts"],
  category: "General",
  description: "Show current timestamp",

  async execute(sock, msg) {
    const now = new Date();

    await sock.sendMessage(msg.key.remoteJid, {
      text:
        "╭━━━〔 ⏱️ ᴛɪᴍᴇsᴛᴀᴍᴘ 〕━━━╮\n" +
        "┃\n" +
        `┃ 📅 ${now.toLocaleString("en-BD", {
          timeZone: "Asia/Dhaka"
        })}\n` +
        `┃ 🔢 ${Math.floor(Date.now() / 1000)}\n` +
        "┃\n" +
        "╰━━━━━━━━━━━━━━━━━━━━╯"
    });
  }
};
