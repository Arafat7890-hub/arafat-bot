module.exports = {
  name: "react",
  aliases: ["reaction"],
  category: "Utility",
  description: "React to a replied message",

  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    const context =
      msg.message?.extendedTextMessage?.contextInfo;

    if (!context?.stanzaId) {
      return sock.sendMessage(jid, {
        text: "❌ আগে যে message-এ reaction দিতে চাও সেটায় reply করে `.react ❤️` দাও।"
      });
    }

    const emoji = args.join(" ").trim();

    if (!emoji) {
      return sock.sendMessage(jid, {
        text: "⚠️ Example: `.react ❤️`"
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
          text: emoji,
          key: quotedKey
        }
      });
    } catch (e) {
      await sock.sendMessage(jid, {
        text: "❌ Reaction দেওয়া যায়নি: " + e.message
      });
    }
  }
};
