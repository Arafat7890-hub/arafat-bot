module.exports = {
  name: "tagadmins",
  aliases: ["tagadmin"],
  category: "Group",
  description: "Mention all group admins",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    if (!jid?.endsWith("@g.us"))
      return sock.sendMessage(jid, {
        text: "❌ শুধু Group-এ ব্যবহার করা যাবে।"
      });

    const meta = await sock.groupMetadata(jid);

    const admins = (meta.participants || []).filter(
      p => p.admin === "admin" || p.admin === "superadmin"
    );

    if (!admins.length)
      return sock.sendMessage(jid, {
        text: "❌ কোনো admin পাওয়া যায়নি।"
      });

    const mentions = admins.map(p => p.id);

    const text = `╭━━━〔 👑 𝗔𝗗𝗠𝗜𝗡 𝗧𝗔𝗚 〕━━━╮
┃
${admins.map((p, i) =>
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
