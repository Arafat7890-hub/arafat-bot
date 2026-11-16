module.exports = {
  name: "ping",
  aliases: ["p"],
  category: "Tools",
  description: "Check bot response speed",

  async execute(sock, msg, args) {
    const start = Date.now();

    await sock.sendMessage(msg.key.remoteJid, {
      text: "🏓 Pinging..."
    });

    const ms = Date.now() - start;

    await sock.sendMessage(msg.key.remoteJid, {
      text: `╭━━━〔 🏓 PONG 〕━━━╮
┃ ⚡ Response : ${ms}ms
┃ 🤖 Bot      : ARAFAT BOT
┃ 📡 Status   : Online
╰━━━━━━━━━━━━━━━━━━╯`
    });
  }
};
