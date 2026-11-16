module.exports = {
  name: "delete",
  aliases: ["del"],
  category: "Group",
  description: "Delete a replied message",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    // Group only
    if (!jid || !jid.endsWith("@g.us")) {
      return sock.sendMessage(jid, {
        text: "❌ এই command শুধু WhatsApp Group-এ ব্যবহার করা যাবে।"
      });
    }

    const context = msg.message?.extendedTextMessage?.contextInfo;

    // Must be a reply
    if (!context?.stanzaId) {
      return sock.sendMessage(jid, {
        text: "⚠️ যে message delete করতে চাও, সেটার reply দিয়ে `.delete` দাও।"
      });
    }

    const quotedKey = {
      remoteJid: jid,
      fromMe: !!context.participant
        ? false
        : true,
      id: context.stanzaId,
      participant: context.participant
    };

    try {
      await sock.sendMessage(jid, {
        delete: quotedKey
      });
    } catch (e) {
      console.log("❌ Delete error:", e.message);

      await sock.sendMessage(jid, {
        text: "❌ Message delete করা যায়নি।"
      });
    }
  }
};
