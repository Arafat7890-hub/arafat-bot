module.exports = {
  name: "shield",
  aliases: ["ashield", "shieldstatus"],
  category: "Protection",
  description: "Arafat Shield control",

  async execute(sock, msg, args = []) {
    const jid = msg.key.remoteJid;

    const sender =
      msg.key.participant ||
      msg.key.remoteJid ||
      "";

    const number =
      sender.split("@")[0].split(":")[0];

    const isOwner =
      msg.key.fromMe ||
      number === "8801890492613";

    if (!isOwner) {
      return sock.sendMessage(jid, {
        text: "❌ Owner only."
      });
    }

    const action = String(args[0] || "status").toLowerCase();

    if (action === "on") {
      global.arafatShieldEnabled = true;
    }

    if (action === "off") {
      global.arafatShieldEnabled = false;
    }

    const status =
      global.arafatShieldEnabled !== false
        ? "🟢 ON"
        : "🔴 OFF";

    await sock.sendMessage(jid, {
      text:
        "╭━━━〔 🛡️ ᴀʀᴀғᴀᴛ sʜɪᴇʟᴅ 〕━━━╮\n" +
        "┃\n" +
        `┃  sᴛᴀᴛᴜs : ${status}\n` +
        "┃ ⚡ ᴍᴇssᴀɢᴇ ʙᴜʀsᴛ\n" +
        "┃ 🔗 ʟɪɴᴋ ғʟᴏᴏᴅ\n" +
        "┃ 📸 ᴍᴇᴅɪᴀ ғʟᴏᴏᴅ\n" +
        "┃ 🔁 ʀᴇᴘᴇᴀᴛ sᴘᴀᴍ\n" +
        "┃ 👥 ᴊᴏɪɴ ʙᴜʀsᴛ\n" +
        "┃\n" +
        "╰━━━━━━━━━━━━━━━━━━━━╯"
    });
  }
};
