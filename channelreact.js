const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const FILE = path.join(DATA_DIR, "channel-react.json");

function load() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return {
      enabled: false,
      emoji: "❤️"
    };
  }
}

function save(data) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  name: "channelreact",
  aliases: ["creact"],
  category: "Channel",
  description: "Auto react to new channel posts",

  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const sub = (args[0] || "").toLowerCase();

    const config = load();

    if (sub === "on") {
      const emoji = args.slice(1).join(" ").trim() || "❤️";

      config.enabled = true;
      config.emoji = emoji;
      save(config);

      return sock.sendMessage(jid, {
        text:
          `✅ 𝗖𝗛𝗔𝗡𝗡𝗘𝗟 𝗔𝗨𝗧𝗢-𝗥𝗘𝗔𝗖𝗧 𝗢𝗡\n\n` +
          `❤️ Reaction: ${emoji}\n` +
          `📌 নতুন Channel post এলে এই reaction দেওয়া হবে।`
      });
    }

    if (sub === "off") {
      config.enabled = false;
      save(config);

      return sock.sendMessage(jid, {
        text: "🛑 𝗖𝗛𝗔𝗡𝗡𝗘𝗟 𝗔𝗨𝗧𝗢-𝗥𝗘𝗔𝗖𝗧 𝗢𝗙𝗙"
      });
    }

    if (sub === "status") {
      return sock.sendMessage(jid, {
        text:
          `📡 𝗖𝗛𝗔𝗡𝗡𝗘𝗟 𝗥𝗘𝗔𝗖𝗧 𝗦𝗧𝗔𝗧𝗨𝗦\n\n` +
          `Status: ${config.enabled ? "🟢 ON" : "🔴 OFF"}\n` +
          `Reaction: ${config.emoji}`
      });
    }

    return sock.sendMessage(jid, {
      text:
        `📌 𝗖𝗵𝗮𝗻𝗻𝗻𝗲𝗹 𝗥𝗲𝗮𝗰𝘁 𝗨𝘀𝗮𝗴𝗲\n\n` +
        `.channelreact on ❤️\n` +
        `.channelreact off\n` +
        `.channelreact status`
    });
  }
};
