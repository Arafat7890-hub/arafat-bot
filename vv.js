module.exports = {
  name: "vv",
  aliases: ["viewonce"],
  category: "Tools",
  description: "View Once helper",

  async execute(sock, msg) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: `╭━━━〔 👁️ 𝗩𝗜𝗘𝗪 𝗢𝗡𝗖𝗘 〕━━━╮
┃
┃ ℹ️ View Once media detected.
┃ 🔐 Privacy protection is enabled.
┃
┃ ⚠️ This command does not bypass
┃    View Once privacy restrictions.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
    });
  }
};
