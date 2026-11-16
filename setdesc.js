module.exports = {
  name: "setdesc",
  aliases: ["groupdesc"],
  category: "Admin",
  description: "Change group description",

  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    if (!jid?.endsWith("@g.us"))
      return sock.sendMessage(jid, { text: "❌ শুধু Group-এ ব্যবহার করা যাবে।" });

    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || jid;
    const me = meta.participants.find(p => p.id === sender);

    if (!me?.admin)
      return sock.sendMessage(jid, { text: "❌ শুধু Group Admin ব্যবহার করতে পারবে।" });

    const desc = args.join(" ").trim();

    if (!desc)
      return sock.sendMessage(jid, { text: "⚙️ Usage: .setdesc Your description" });

    try {
      await sock.groupUpdateDescription(jid, desc);
      await sock.sendMessage(jid, { text: "✅ Group description updated successfully." });
    } catch {
      await sock.sendMessage(jid, { text: "❌ Description update failed." });
    }
  }
};
