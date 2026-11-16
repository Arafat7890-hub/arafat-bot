module.exports = {
  name: "unblock",
  aliases: [],
  category: "Owner",
  description: "Unblock a WhatsApp user",

  async execute(sock, msg, args) {
    const jid = msg.message?.extendedTextMessage?.contextInfo?.participant ||
      (args[0] ? args[0].replace(/\D/g, "") + "@s.whatsapp.net" : null);

    if (!jid) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "⚙️ Usage: .unblock <number> অথবা user-এর message-এ reply করে .unblock"
      });
    }

    try {
      await sock.updateBlockStatus(jid, "unblock");
      await sock.sendMessage(msg.key.remoteJid, {
        text: "🔓 𝗨𝗡𝗕𝗟𝗢𝗖𝗞\n\n✅ User unblocked successfully."
      });
    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Unblock failed."
      });
    }
  }
};
