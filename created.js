module.exports = {
  name: "created",
  aliases: ["creation"],
  category: "Group",
  description: "Show group creation time",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    if (!jid?.endsWith("@g.us"))
      return sock.sendMessage(jid, {
        text: "❌ শুধু Group-এ ব্যবহার করা যাবে।"
      });

    const meta = await sock.groupMetadata(jid);

    if (!meta.creation) {
      return sock.sendMessage(jid, {
        text: "❌ Group creation date পাওয়া যায়নি।"
      });
    }

    const date = new Date(meta.creation * 1000);

    const formatted = date.toLocaleString("en-GB", {
      timeZone: "Asia/Dhaka",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

    await sock.sendMessage(jid, {
      text: `╭━━━〔 📅 𝗚𝗥𝗢𝗨𝗣 𝗖𝗥𝗘𝗔𝗧𝗘𝗗 〕━━━╮
┃
┃ 🏷️ Group : ${meta.subject}
┃ 🕐 Created : ${formatted}
┃ 🇧🇩 Timezone : Bangladesh
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
    });
  }
};
