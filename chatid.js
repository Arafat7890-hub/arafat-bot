module.exports = {
  name: "chatid",
  aliases: ["cid"],
  category: "General",
  description: "Show current chat ID",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid || "Unknown";

    await sock.sendMessage(jid, {
      text:
        "╭━━━〔 🆔 ᴄʜᴀᴛ ɪᴅ 〕━━━╮\n" +
        "┃\n" +
        `┃ 📌 ᴊɪᴅ : ${jid}\n` +
        "┃\n" +
        "╰━━━━━━━━━━━━━━━━╯"
    });
  }
};
