const features = require("../lib/groupFeatures");
const { isGroupAdmin } = require("../lib/groupFeatureHelpers");

module.exports = {
  name: "autogcstatus",
  aliases: [],
  category: "GROUP",
  description: "Enable or disable group automation",

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
      const current = features.get(jid)["autogcstatus"] ? "ON" : "OFF";

      return sock.sendMessage(jid, {
        text:
          "⚙️ AUTOGCSTATUS\n\n" +
          "Status: " + current + "\n\n" +
          "Use:\n.autogcstatus on\n.autogcstatus off"
      });
    }

    features.set(jid, "autogcstatus", mode === "on");

    await sock.sendMessage(jid, {
      text:
        "╭─〔 AUTOGCSTATUS 〕\n" +
        "├ Status: " + mode.toUpperCase() + "\n" +
        "╰────────────────"
    });
  }
};
