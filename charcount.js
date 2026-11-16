module.exports = {
  name: "charcount",
  aliases: ["length"],
  category: "Tools",
  description: "Count characters and words",

  async execute(sock, msg, args) {
    const text = args.join(" ");

    if (!text)
      return sock.sendMessage(msg.key.remoteJid, {
        text: "⚙️ Usage: .charcount Hello world"
      });

    const characters = [...text].length;
    const words = text.trim().split(/\s+/).length;

    await sock.sendMessage(msg.key.remoteJid, {
      text: `📊 ᴄʜᴀʀᴀᴄᴛᴇʀ ᴄᴏᴜɴᴛ\n\n➤ ᴄʜᴀʀᴀᴄᴛᴇʀs : ${characters}\n➤ ᴡᴏʀᴅs : ${words}`
    });
  }
};
