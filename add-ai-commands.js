const fs = require("fs");
const path = require("path");

const dir = path.join(process.cwd(), "commands");

const commands = {
  ask: "Ask Arafat Bbz AI",
  explain: "Explain a topic with AI",
  summarize: "Summarize text with AI",
  translate: "Translate text with AI",
  grammar: "Fix grammar with AI",
  rewrite: "Rewrite text with AI",
  code: "Get coding help with AI",
  debug: "Debug code with AI",
  math: "Solve or explain math with AI"
};

const template = (name, description) => `const { ask } = require("../lib/ai");

module.exports = {
  name: "${name}",
  aliases: [],
  category: "AI",
  description: "${description}",

  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const prompt = args.join(" ").trim();

    if (!prompt) {
      return sock.sendMessage(jid, {
        text: "🤖 𝗔𝗿𝗮𝗳𝗮𝘁 𝗔𝗜\\n\\nUsage: .${name} your text"
      });
    }

    try {
      const answer = await ask(
        "${description}.\\n\\nUser request:\\n" + prompt
      );

      await sock.sendMessage(jid, {
        text: "🤖 𝗔𝗿𝗮𝗳𝗮𝘁 𝗔𝗜\\n\\n" + answer
      });
    } catch (e) {
      console.log("❌ AI ${name}:", e.message);

      await sock.sendMessage(jid, {
        text: "❌ AI Error\\n\\n" + e.message
      });
    }
  }
};
`;

for (const [name, description] of Object.entries(commands)) {
  const file = path.join(dir, `${name}.js`);

  if (fs.existsSync(file)) {
    console.log(`⏭️ Exists: ${name}.js`);
    continue;
  }

  fs.writeFileSync(file, template(name, description));
  console.log(`✅ Created: ${name}.js`);
}

console.log("\n🎉 AI COMMAND PACK DONE");
