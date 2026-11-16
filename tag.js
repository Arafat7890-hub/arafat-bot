module.exports = {
  name: "tag",
  aliases: ["mention"],
  category: "Group",
  description: "Tag a replied member",

  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    if (!jid?.endsWith("@g.us"))
      return sock.sendMessage(jid, { text: "❌ শুধু Group-এ ব্যবহার করা যাবে।" });

    const target = msg.message?.extendedTextMessage?.contextInfo?.participant;

    if (!target)
      return sock.sendMessage(jid, {
        text: "⚙️ কোনো Member-এর message-এ reply করে `.tag` দাও।"
      });

    const text = args.join(" ") || `📢 @${target.split("@")[0]}`;

    await sock.sendMessage(jid, {
      text,
      mentions: [target]
    });
  }
};
