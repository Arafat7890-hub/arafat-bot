module.exports = {
  name: "choose",
  aliases: ["pick"],
  category: "Fun",
  description: "Choose randomly from options",

  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const options = args.join(" ").split("|").map(x => x.trim()).filter(Boolean);

    if (options.length < 2)
      return sock.sendMessage(jid, {
        text: "⚙️ Usage: .choose Pizza | Burger | Biryani"
      });

    const result = options[Math.floor(Math.random() * options.length)];

    await sock.sendMessage(jid, {
      text: `🎯 ᴄʜᴏᴏsᴇ\n\n➤ ʀᴇsᴜʟᴛ : ${result}`
    });
  }
};
