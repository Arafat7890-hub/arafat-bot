module.exports = {
  name: "say",
  aliases: ["speak"],
  category: "Tools",
  description: "Repeat text",

  async execute(sock, msg, args) {
    const text = args.join(" ");

    if (!text)
      return sock.sendMessage(msg.key.remoteJid, {
        text: "⚙️ Usage: .say Hello everyone"
      });

    await sock.sendMessage(msg.key.remoteJid, {
      text
    });
  }
};
