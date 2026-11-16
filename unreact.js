module.exports = {
  name: "unreact",
  aliases: ["removereact"],
  category: "Utility",
  description: "Remove bot reaction from a replied message",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    const context =
      msg.message?.extendedTextMessage?.contextInfo;

    if (!context?.stanzaId) {
      return sock.sendMessage(jid, {
        text: "❌ আগে message-এ reply করো।"
      });
    }

    const quotedKey = {
      remoteJid: jid,
      id: context.stanzaId,
      participant: context.participant,
      fromMe: false
    };

    try {
      await sock.sendMessage(jid, {
        react: {
          text: "",
          key: quotedKey
        }
      });
    } catch (e) {
      await sock.sendMessage(jid, {
        text: "❌ Reaction remove করা যায়নি: " + e.message
      });
    }
  }
};
