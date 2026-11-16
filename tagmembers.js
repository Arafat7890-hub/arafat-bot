module.exports = {
  name: "tagmembers",
  aliases: ["tagmember"],
  category: "Group",
  description: "Mention all non-admin members",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    if (!jid?.endsWith("@g.us"))
      return sock.sendMessage(jid, {
        text: "❌ শুধু Group-এ ব্যবহার করা যাবে।"
      });

    const meta = await sock.groupMetadata(jid);

    const members = (meta.participants || []).filter(
      p => !p.admin
    );

    if (!members.length)
      return sock.sendMessage(jid, {
        text: "❌ কোনো regular member পাওয়া যায়নি।"
      });

    const mentions = members.map(p => p.id);

    const text = `╭━━━〔 👥 𝗠𝗘𝗠𝗕𝗘𝗥 𝗧𝗔𝗚 〕━━━╮
┃
${members.map((p, i) =>
  `┃ ${String(i + 1).padStart(2, "0")} │ @${p.id.split("@")[0]}`
).join("\n")}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`;

    await sock.sendMessage(jid, {
      text,
      mentions
    });
  }
};
