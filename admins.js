module.exports = {
  name: "admins",
  aliases: ["admin", "staff"],
  category: "Group",
  description: "Mention all group admins",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    if (!jid || !jid.endsWith("@g.us")) {
      return sock.sendMessage(jid, {
        text: "❌ এই command শুধু WhatsApp Group-এ ব্যবহার করা যাবে।"
      });
    }

    try {
      const metadata = await sock.groupMetadata(jid);
      const admins = (metadata.participants || []).filter(p => p.admin);

      if (!admins.length) {
        return sock.sendMessage(jid, {
          text: "⚠️ এই group-এ কোনো admin পাওয়া যায়নি।"
        });
      }

      const mentions = admins.map(p => p.id);

      let text = `╭━━━〔 👑 𝗔𝗗𝗠𝗜𝗡 𝗧𝗘𝗔𝗠 〕━━━╮
┃
┃ 🏷️ 𝗚𝗿𝗼𝘂𝗽 : ${metadata.subject || "Unknown"}
┃ 👑 𝗧𝗼𝘁𝗮𝗹 𝗔𝗱𝗺𝗶𝗻 : ${admins.length}
┃
╰━━━━━━━━━━━━━━━━━━━━╯

`;

      admins.forEach((p, i) => {
        text += `┃ ${String(i + 1).padStart(2, "0")} │ @${p.id.split("@")[0]}\n`;
      });

      text += `╰━━━━━━━━━━━━━━━━━━━━╯`;

      await sock.sendMessage(jid, {
        text,
        mentions
      });

    } catch (e) {
      console.log("❌ Admins error:", e.message);

      await sock.sendMessage(jid, {
        text: "❌ Admin list পাওয়া যায়নি।"
      });
    }
  }
};
