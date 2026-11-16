module.exports = {
  name: "reverse",
  aliases: ["rev"],
  category: "Tools",
  description: "Reverse text",

  async execute(sock, msg, args) {
    const text = args.join(" ");

    if (!text)
      return sock.sendMessage(msg.key.remoteJid, {
        text: "⚙️ Usage: .reverse Hello"
      });

    const reversed = [...text].reverse().join("");

    await sock.sendMessage(msg.key.remoteJid, {
      text: `🔄 ʀᴇᴠᴇʀsᴇ\n\n➤ ${reversed}`
    });
  }
};
