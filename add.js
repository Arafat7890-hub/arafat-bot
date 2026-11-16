module.exports = {
  name: "add",
  aliases: [],
  category: "Admin",
  description: "Add a member to the group",

  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    if (!jid?.endsWith("@g.us"))
      return sock.sendMessage(jid, { text: "❌ এই command শুধু Group-এ ব্যবহার করা যাবে।" });

    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || msg.key.remoteJid;
    const me = meta.participants.find(p => p.id === sender);

    if (!me?.admin)
      return sock.sendMessage(jid, { text: "❌ শুধু Group Admin ব্যবহার করতে পারবে।" });

    const number = (args[0] || "").replace(/\D/g, "");
    if (!number)
      return sock.sendMessage(jid, { text: "⚙️ Usage: .add 8801XXXXXXXXX" });

    const target = `${number}@s.whatsapp.net`;

    try {
      await sock.groupParticipantsUpdate(jid, [target], "add");
      await sock.sendMessage(jid, { text: "✅ 𝗔𝗗𝗗\n\n👤 Member add request sent successfully." });
    } catch {
      await sock.sendMessage(jid, { text: "❌ Member add failed." });
    }
  }
};
