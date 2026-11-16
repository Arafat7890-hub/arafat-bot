module.exports = {
  name: "uppercase",
  aliases: ["upper", "up"],
  category: "Tools",
  description: "Convert text to uppercase",
  async execute(sock, msg, args) {
    const text = args.join(" ");
    if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "✍️ ব্যবহার: .uppercase hello world" });
    await sock.sendMessage(msg.key.remoteJid, { text: text.toUpperCase() });
  }
};
