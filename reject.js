module.exports = {
  name: "reject",
  aliases: ["rejectrequest"],
  category: "Admin",
  description: "Reject a group join request",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    if (!jid?.endsWith("@g.us"))
      return sock.sendMessage(jid, { text: "❌ শুধু Group-এ ব্যবহার করা যাবে।" });

    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || jid;
    const me = meta.participants.find(p => p.id === sender);

    if (!me?.admin)
      return sock.sendMessage(jid, { text: "❌ শুধু Group Admin ব্যবহার করতে পারবে।" });

    const target =
      msg.message?.extendedTextMessage?.contextInfo?.participant;

    if (!target)
      return sock.sendMessage(jid, {
        text: "⚙️ Request message-এ reply করে `.reject` দাও।"
      });

    try {
      await sock.groupRequestParticipantsUpdate(jid, [target], "reject");

      await sock.sendMessage(jid, {
        text: `❌ @${target.split("@")[0]} এর join request rejected.`,
        mentions: [target]
      });
    } catch {
      await sock.sendMessage(jid, { text: "❌ Rejection failed." });
    }
  }
};
