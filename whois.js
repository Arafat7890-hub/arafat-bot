module.exports = {
  name: "whois",
  aliases: ["user"],
  category: "Group",
  description: "Show basic member info",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    if (!jid?.endsWith("@g.us"))
      return sock.sendMessage(jid, {
        text: "❌ শুধু Group-এ ব্যবহার করা যাবে।"
      });

    const target =
      msg.message?.extendedTextMessage?.contextInfo?.participant;

    if (!target)
      return sock.sendMessage(jid, {
        text: "⚙️ Member-এর message-এ reply করে `.whois` দাও।"
      });

    const meta = await sock.groupMetadata(jid);
    const user = meta.participants.find(p => p.id === target);

    if (!user)
      return sock.sendMessage(jid, {
        text: "❌ Member পাওয়া যায়নি।"
      });

    const role = user.admin
      ? user.admin === "superadmin" ? "👑 Super Admin" : "🛡️ Admin"
      : "👤 Member";

    await sock.sendMessage(jid, {
      text: `╭━━━〔 👤 𝗪𝗛𝗢𝗜𝗦 〕━━━╮
┃
┃ 📱 User : @${target.split("@")[0]}
┃ 🏷️ Role : ${role}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`,
      mentions: [target]
    });
  }
};
