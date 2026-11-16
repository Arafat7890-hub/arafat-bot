module.exports = {
  name: "coin",
  aliases: ["flipcoin"],
  category: "Fun",
  description: "Flip a coin",
  async execute(sock, msg) {
    const result = Math.random() < 0.5 ? "🪙 ʜᴇᴀᴅs" : "🪙 ᴛᴀɪʟs";
    await sock.sendMessage(msg.key.remoteJid, { text: `╭━━〔 🪙 ᴄᴏɪɴ 〕━━╮\n┃\n┃ 🎯 ${result}\n┃\n╰━━━━━━━━━━━━╯` });
  }
};
