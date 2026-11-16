module.exports = {
  name: "random",
  aliases: ["rand"],
  category: "Fun",
  description: "Generate a random number",

  async execute(sock, msg, args) {
    const max = Math.max(1, Number(args[0]) || 100);
    const result = Math.floor(Math.random() * max) + 1;

    await sock.sendMessage(msg.key.remoteJid, {
      text: `🎲 ʀᴀɴᴅᴏᴍ\n\n➤ ʟɪᴍɪᴛ : ${max}\n➤ ʀᴇsᴜʟᴛ : ${result}`
    });
  }
};
