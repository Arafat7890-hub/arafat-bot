const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "data", "warnings.json");

function load() {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch { return {}; }
}

module.exports = {
  name: "warnings",
  aliases: ["warns"],
  category: "Group",
  description: "Show warnings",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    if (!jid?.endsWith("@g.us")) return sock.sendMessage(jid, {
      text: "❌ এই command শুধু Group-এ ব্যবহার করা যাবে।"
    });

    const target =
      msg.message?.extendedTextMessage?.contextInfo?.participant ||
      msg.key.participant;

    if (!target) return sock.sendMessage(jid, {
      text: "⚠️ Member-এর message reply করে `.warnings` দাও।"
    });

    const data = load();
    const count = data[jid]?.[target] || 0;

    await sock.sendMessage(jid, {
      text: `⚠️ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚𝗦\n\n👤 @${target.split("@")[0]}\n📌 Total: ${count}`,
      mentions: [target]
    });
  }
};
