module.exports = {
  name: "settings",
  aliases: ["groupstatus"],
  category: "Group",
  description: "Show group settings",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    if (!jid?.endsWith("@g.us"))
      return sock.sendMessage(jid, { text: "❌ শুধু Group-এ ব্যবহার করা যাবে।" });

    try {
      const meta = await sock.groupMetadata(jid);

      const admins = meta.participants.filter(
        p => p.admin === "admin" || p.admin === "superadmin"
      ).length;

      await sock.sendMessage(jid, {
        text: `╭━━━〔 ⚙️ 𝗚𝗥𝗢𝗨𝗣 𝗦𝗘𝗧𝗧𝗜𝗡𝗚𝗦 〕━━━╮
┃
┃ 🏷️ Name : ${meta.subject}
┃ 👥 Members : ${meta.participants.length}
┃ 👑 Admins : ${admins}
┃ 📝 Description : ${meta.desc ? "Set" : "None"}
┃ 🔐 Restriction : ${meta.restrict ? "ON" : "OFF"}
┃ 📢 Announcement : ${meta.announce ? "ON" : "OFF"}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
      });
    } catch {
      await sock.sendMessage(jid, { text: "❌ Could not fetch group settings." });
    }
  }
};
