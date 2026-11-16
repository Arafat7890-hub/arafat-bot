module.exports = {
  name: "requests",
  aliases: ["joinrequests"],
  category: "Admin",
  description: "Show pending group join requests",

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
      const requests = await sock.groupRequestParticipantsList(jid);

      if (!requests?.length)
        return sock.sendMessage(jid, {
          text: "📭 কোনো pending join request নেই।"
        });

      const mentions = requests.map(x => x.jid || x.id || x.phoneNumber);

      const text = `╭━━━〔 📥 𝗝𝗢𝗜𝗡 𝗥𝗘𝗤𝗨𝗘𝗦𝗧𝗦 〕━━━╮
┃
${mentions.map((x, i) =>
  `┃ ${String(i + 1).padStart(2, "0")} │ @${x.split("@")[0]}`
).join("\n")}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`;

      await sock.sendMessage(jid, {
        text,
        mentions
      });
    } catch {
      await sock.sendMessage(jid, {
        text: "❌ Join request list পাওয়া যায়নি।"
      });
    }
  }
};
