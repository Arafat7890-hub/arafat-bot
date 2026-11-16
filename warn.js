const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "data", "warnings.json");

function load() {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch { return {}; }
}

function save(data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {
  name: "warn",
  aliases: [],
  category: "Group",
  description: "Warn a replied member",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    const { getGroupAdmin } = require("../lib/groupAdmin");
    const { isAdmin } = await getGroupAdmin(sock, jid);

    if (!isAdmin) {
      return sock.sendMessage(jid, {
        text: "❌ শুধু Group Admin এই command ব্যবহার করতে পারবে।"
      });
    }


    if (!jid?.endsWith("@g.us")) return sock.sendMessage(jid, {
      text: "❌ এই command শুধু Group-এ ব্যবহার করা যাবে।"
    });

    const target = msg.message?.extendedTextMessage?.contextInfo?.participant;
    if (!target) return sock.sendMessage(jid, {
      text: "⚠️ যাকে warn করতে চাও তার message reply করে `.warn` দাও।"
    });

    const data = load();
    data[jid] = data[jid] || {};
    data[jid][target] = (data[jid][target] || 0) + 1;
    save(data);

    await sock.sendMessage(jid, {
      text: `⚠️ @${target.split("@")[0]}-কে warning দেওয়া হয়েছে।\n\n📌 Total Warning: ${data[jid][target]}`,
      mentions: [target]
    });
  }
};
