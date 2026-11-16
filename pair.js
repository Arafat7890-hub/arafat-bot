const { startSession, requestPairingCode } =
  require("../lib/sessionConnector");

module.exports = {
  name: "pair",
  aliases: ["paircode"],
  category: "System",
  description: "Generate a pairing code for a session",

  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    if (!msg.key.fromMe) {
      return sock.sendMessage(jid, {
        text: "❌ এই command শুধু bot owner ব্যবহার করতে পারবে।"
      });
    }

    const slot = args[0] || "1";
    const phone = String(args[1] || "").replace(/\D/g, "");

    if (!phone) {
      return sock.sendMessage(jid, {
        text: "📌 Usage:\n.pair <slot> <country-codeসহ number>"
      });
    }

    try {
      await startSession(slot);

      await new Promise(resolve => setTimeout(resolve, 3000));

      const code = await requestPairingCode(slot, phone);

      await sock.sendMessage(jid, {
        text:
          `🔐 𝗦𝗟𝗢𝗧 ${slot} 𝗣𝗔𝗜𝗥𝗜𝗡𝗚\n\n` +
          `📱 Number: ${phone}\n` +
          `🔑 Code: ${code}\n\n` +
          `WhatsApp → Linked Devices → Link with phone number`
      });
    } catch (e) {
      console.log("PAIR ERROR:", e.message);

      await sock.sendMessage(jid, {
        text: `❌ Pairing failed.\n\n${e.message}`
      });
    }
  }
};
