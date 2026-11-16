module.exports = {
  name: "setname",
  aliases: ["groupname"],
  category: "Admin",
  description: "Change group name",

  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    if (!jid?.endsWith("@g.us"))
      return sock.sendMessage(jid, { text: "❌ শুধু Group-এ ব্যবহার করা যাবে।" });

    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || jid;
    const me = meta.participants.find(p => p.id === sender);

    if (!me?.admin)
      return sock.sendMessage(jid, { text: "❌ শুধু Group Admin ব্যবহার করতে পারবে।" });

    const name = args.join(" ").trim();

    if (!name)
      return sock.sendMessage(jid, { text: "⚙️ Usage: .setname New Group Name" });

    try {
      await sock.groupUpdateSubject(jid, name);
      await sock.sendMessage(jid, { text: "✅ Group name updated successfully." });
    } catch {
      await sock.sendMessage(jid, { text: "❌ Group name update failed." });
    }
  }
};
