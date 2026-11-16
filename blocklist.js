module.exports = {
  name: "blocklist",
  aliases: ["blocked"],
  category: "Owner",
  description: "Show blocked users",

  async execute(sock, msg) {
    try {
      const list = await sock.fetchBlocklist();

      if (!list?.length) {
        return sock.sendMessage(msg.key.remoteJid, {
          text: "📋 𝗕𝗟𝗢𝗖𝗞 𝗟𝗜𝗦𝗧\n\n✅ No blocked users."
        });
      }

      const text = list.map((x, i) =>
        `${String(i + 1).padStart(2, "0")} │ @${x.split("@")[0]}`
      ).join("\n");

      await sock.sendMessage(msg.key.remoteJid, {
        text: `╭━━━〔 🚫 𝗕𝗟𝗢𝗖𝗞 𝗟𝗜𝗦𝗧 〕━━━╮
┃
${text}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`,
        mentions: list
      });
    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Could not fetch block list."
      });
    }
  }
};
