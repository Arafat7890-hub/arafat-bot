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
  name: "resetwarn",
  aliases: ["clearwarn"],
  category: "Group",
  description: "Reset warnings",

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
      text: "⚠️ Member-এর message reply করে `.resetwarn` দাও।"
    });

    const data = load();
    if (data[jid]) delete data[jid][target];
    save(data);

    await sock.sendMessage(jid, {
      text: `✅ @${target.split("@")[0]}-এর warnings reset করা হয়েছে।`,
      mentions: [target]
    });
  }
};
