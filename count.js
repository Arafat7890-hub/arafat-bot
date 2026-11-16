module.exports = {
  name: "count",
  aliases: ["members"],
  category: "Group",
  description: "Count group members",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    if (!jid.endsWith("@g.us")) {
      return sock.sendMessage(jid, {
        text: "❌ এই command শুধু Group-এ ব্যবহার করা যাবে।"
      });
    }

    const metadata = await sock.groupMetadata(jid);

    await sock.sendMessage(jid, {
      text: `👥 𝗚𝗥𝗢𝗨𝗣 𝗖𝗢𝗨𝗡𝗧\n\n🏷️ ${metadata.subject}\n👤 Members : ${metadata.participants.length}`
    });
  }
};
