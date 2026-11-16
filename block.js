module.exports = {
  name: "block",
  aliases: [],
  category: "Owner",
  description: "Block a WhatsApp user",

  async execute(sock, msg, args) {
    const jid = msg.message?.extendedTextMessage?.contextInfo?.participant ||
      (args[0] ? args[0].replace(/\D/g, "") + "@s.whatsapp.net" : null);

    if (!jid) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "⚙️ Usage: .block <number> অথবা user-এর message-এ reply করে .block"
      });
    }

    try {
      await sock.updateBlockStatus(jid, "block");
      await sock.sendMessage(msg.key.remoteJid, {
        text: "🚫 𝗕𝗟𝗢𝗖𝗞\n\n✅ User blocked successfully."
      });
    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Block failed."
      });
    }
  }
};
