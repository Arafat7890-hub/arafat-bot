module.exports = {
  name: "tagall",
  aliases: ["everyone", "all"],
  category: "Group",
  description: "Mention all group members",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    if (!jid.endsWith("@g.us")) {
      return sock.sendMessage(jid, {
        text: "❌ এই command শুধু WhatsApp Group-এ ব্যবহার করা যাবে।"
      });
    }

    const metadata = await sock.groupMetadata(jid);
    const participants = metadata.participants;

    const mentions = participants.map(p => p.id);

    let text = `╭━━━〔 📢 𝗧𝗔𝗚 𝗔𝗟𝗟 〕━━━╮
┃
┃ 👥 𝗚𝗿𝗼𝘂𝗽 : ${metadata.subject}
┃ 👥 𝗠𝗲𝗺𝗯𝗲𝗿𝘀 : ${participants.length}
┃
╰━━━━━━━━━━━━━━━━━━━━╯

╭──〔 👥 𝗠𝗘𝗠𝗕𝗘𝗥𝗦 〕──╮
`;

    participants.forEach((p, i) => {
      text += `┃ ${String(i + 1).padStart(2, "0")} │ @${p.id.split("@")[0]}\n`;
    });

    text += `╰━━━━━━━━━━━━━━━━━━━━╯

⚡ 𝗧𝗵𝗮𝗻𝗸 𝘆𝗼𝘂 𝗳𝗼𝗿 𝗯𝗲𝗶𝗻𝗴 𝗵𝗲𝗿𝗲! 🤍\n\n╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴\n⚡ 𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗥 — 𝘼ʀᴀғᴀᴛ 𝘽ʙᴢ ᥫ᭡\n╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴`;

    await sock.sendMessage(jid, {
      text,
      mentions
    });
  }
};
