module.exports = {
  name: "countx",
  aliases: [],
  category: "Group",
  description: "Show members and admins count",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    if (!jid.endsWith("@g.us")) {
      return sock.sendMessage(jid, {
        text: "❌ এই command শুধু Group-এ ব্যবহার করা যাবে।"
      });
    }

    const metadata = await sock.groupMetadata(jid);
    const members = metadata.participants.length;
    const admins = metadata.participants.filter(
      p => p.admin === "admin" || p.admin === "superadmin"
    ).length;

    await sock.sendMessage(jid, {
      text: `╭━━━〔 📊 𝗖𝗢𝗨𝗡𝗧 𝗫 〕━━━╮
┃
┃ 👥 Members : ${members}
┃ 👑 Admins  : ${admins}
┃ 👤 Others  : ${members - admins}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
    });
  }
};
