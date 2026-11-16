const features = require("../lib/groupFeatures");
const { isGroupAdmin } = require("../lib/groupFeatureHelpers");

module.exports = {
  name: "antilinkgc",
  aliases: [],
  category: "GROUP",
  description: "Enable or disable group link protection",

  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    if (!jid?.endsWith("@g.us")) {
      return sock.sendMessage(jid, {
        text: "❌ This command works only in groups."
      });
    }

    if (!(await isGroupAdmin(sock, jid, msg))) {
      return sock.sendMessage(jid, {
        text: "❌ Only group admins can use this command."
      });
    }

    const mode = String(args[0] || "").toLowerCase();

    if (!["on", "off"].includes(mode)) {
      const current = features.get(jid)["antilinkgc"] ? "ON" : "OFF";

      return sock.sendMessage(jid, {
        text:
          "⚙️ ANTILINKGC\n\n" +
          "Status: " + current + "\n\n" +
          "Use:\n.antilinkgc on\n.antilinkgc off"
      });
    }

    features.set(jid, "antilinkgc", mode === "on");

    await sock.sendMessage(jid, {
      text:
        "╭─〔 ANTILINKGC 〕\n" +
        "├ Status: " + mode.toUpperCase() + "\n" +
        "╰────────────────"
    });
  }
};
