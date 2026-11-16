module.exports = {
  name: "calc",
  aliases: ["calculate"],
  category: "Tools",
  description: "Basic calculator",

  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const expr = args.join(" ");

    if (!expr)
      return sock.sendMessage(jid, {
        text: "⚙️ Usage: .calc 25 + 15"
      });

    if (!/^[0-9+\-*/().%\s]+$/.test(expr))
      return sock.sendMessage(jid, {
        text: "❌ শুধু basic math expression ব্যবহার করো।"
      });

    try {
      const result = Function(`"use strict"; return (${expr})`)();
      await sock.sendMessage(jid, {
        text: `🧮 ᴄᴀʟᴄ\n\n➤ ${expr} = ${result}`
      });
    } catch {
      await sock.sendMessage(jid, {
        text: "❌ হিসাবটি সঠিক নয়।"
      });
    }
  }
};
