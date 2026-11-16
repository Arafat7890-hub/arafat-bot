const features = require("../lib/groupFeatures");
const { isGroupAdmin } = require("../lib/groupFeatureHelpers");

module.exports = {
  name: "welcome2",
  aliases: [],
  category: "GROUP",
  description: "Enable or disable alternate welcome messages",

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
      const current = features.get(jid)["welcome2"] ? "ON" : "OFF";

      return sock.sendMessage(jid, {
        text:
          "⚙️ WELCOME2\n\n" +
          "Status: " + current + "\n\n" +
          "Use:\n.welcome2 on\n.welcome2 off"
      });
    }

    features.set(jid, "welcome2", mode === "on");

    await sock.sendMessage(jid, {
      text:
        "╭─〔 WELCOME2 〕\n" +
        "├ Status: " + mode.toUpperCase() + "\n" +
        "╰────────────────"
    });
  }
};
