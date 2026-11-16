module.exports = {
  name: "lowercase",
  aliases: ["lower", "low"],
  category: "Tools",
  description: "Convert text to lowercase",
  async execute(sock, msg, args) {
    const text = args.join(" ");
    if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "✍️ ব্যবহার: .lowercase HELLO WORLD" });
    await sock.sendMessage(msg.key.remoteJid, { text: text.toLowerCase() });
  }
};
