module.exports = {
  name: "revoke",
  aliases: ["resetlink"],
  category: "Admin",
  description: "Reset group invite link",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    if (!jid?.endsWith("@g.us"))
      return sock.sendMessage(jid, { text: "❌ শুধু Group-এ ব্যবহার করা যাবে।" });

    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || jid;
    const me = meta.participants.find(p => p.id === sender);

    if (!me?.admin)
      return sock.sendMessage(jid, { text: "❌ শুধু Group Admin ব্যবহার করতে পারবে।" });

    try {
      const code = await sock.groupRevokeInvite(jid);

      await sock.sendMessage(jid, {
        text: `♻️ 𝗜𝗡𝗩𝗜𝗧𝗘 𝗟𝗜𝗡𝗞 𝗥𝗘𝗦𝗘𝗧\n\n🔗 New Link:\nhttps://chat.whatsapp.com/${code}`
      });
    } catch {
      await sock.sendMessage(jid, { text: "❌ Invite link reset failed." });
    }
  }
};
