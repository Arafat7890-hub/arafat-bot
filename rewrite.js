const { ask } = require("../lib/ai");

module.exports = {
  name: "rewrite",
  aliases: [],
  category: "AI",
  description: "Rewrite text with AI",

  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const prompt = args.join(" ").trim();

    if (!prompt) {
      return sock.sendMessage(jid, {
        text: "🤖 𝗔𝗿𝗮𝗳𝗮𝘁 𝗔𝗜\n\nUsage: .rewrite your text"
      });
    }

    try {
      const answer = await ask(
        "Rewrite text with AI.\n\nUser request:\n" + prompt
      );

      await sock.sendMessage(jid, {
        text: "🤖 𝗔𝗿𝗮𝗳𝗮𝘁 𝗔𝗜\n\n" + answer
      });
    } catch (e) {
      console.log("❌ AI rewrite:", e.message);

      await sock.sendMessage(jid, {
        text: "❌ AI Error\n\n" + e.message
      });
    }
  }
};
