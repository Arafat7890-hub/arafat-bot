const { ask } = require("../lib/ai");

module.exports = {
  name: "ai",
  aliases: ["assistant"],
  category: "AI",
  description: "Ask Arafat Bbz AI",

  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const prompt = args.join(" ").trim();

    if (!prompt) {
      return sock.sendMessage(jid, {
        text: "🤖 𝗔𝗿𝗮𝗳𝗮𝘁 𝗔𝗜\n\nExample:\n.ai hello\n.ai explain JavaScript"
      });
    }

    try {
      const answer = await ask(prompt);

      await sock.sendMessage(jid, {
        text: `🤖 𝗔𝗿𝗮𝗳𝗮𝘁 𝗔𝗜\n\n${answer}`
      });
    } catch (e) {
      console.log("❌ AI:", e.message);

      await sock.sendMessage(jid, {
        text: `❌ AI Error\n\n${e.message}`
      });
    }
  }
};
