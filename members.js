module.exports = {
  name: "members",
  aliases: ["memberlist"],
  category: "Group",
  description: "Show group members",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    if (!jid?.endsWith("@g.us"))
      return sock.sendMessage(jid, {
        text: "❌ শুধু Group-এ ব্যবহার করা যাবে।"
      });

    const meta = await sock.groupMetadata(jid);
    const participants = meta.participants || [];

    const list = participants.map((p, i) => {
      const role = p.admin ? "👑" : "👤";
      return `${String(i + 1).padStart(2, "0")} │ ${role} @${p.id.split("@")[0]}`;
    }).join("\n");

    await sock.sendMessage(jid, {
      text: `╭━━━〔 👥 𝗠𝗘𝗠𝗕𝗘𝗥𝗦 〕━━━╮
┃
${list}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`,
      mentions: participants.map(p => p.id)
    });
  }
};
