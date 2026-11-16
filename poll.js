module.exports = {
  name: "poll",
  aliases: ["vote"],
  category: "Group",
  description: "Create a group poll",

  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    if (!jid?.endsWith("@g.us"))
      return sock.sendMessage(jid, {
        text: "❌ শুধু Group-এ ব্যবহার করা যাবে।"
      });

    const input = args.join(" ");
    const parts = input
      .split("|")
      .map(x => x.trim())
      .filter(Boolean);

    if (parts.length < 3)
      return sock.sendMessage(jid, {
        text: "⚙️ Usage:\n.poll Question | Option 1 | Option 2"
      });

    const question = parts[0];
    const options = [...new Set(parts.slice(1))];

    if (options.length < 2)
      return sock.sendMessage(jid, {
        text: "❌ কমপক্ষে ২টি আলাদা option লাগবে।"
      });

    if (options.length > 12)
      return sock.sendMessage(jid, {
        text: "❌ সর্বোচ্চ ১২টি option দেওয়া যাবে।"
      });

    await sock.sendMessage(jid, {
      poll: {
        name: question,
        values: options,
        selectableCount: 1
      }
    });
  }
};
