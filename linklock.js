const features = require("../lib/groupFeatures");
const { isGroupAdmin } = require("../lib/groupFeatureHelpers");

module.exports = {
  name: "linklock",
  aliases: [],
  category: "GROUP",
  description: "Enable or disable link lock",

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
      const current = features.get(jid)["linklock"] ? "ON" : "OFF";

      return sock.sendMessage(jid, {
        text:
          "⚙️ LINKLOCK\n\n" +
          "Status: " + current + "\n\n" +
          "Use:\n.linklock on\n.linklock off"
      });
    }

    features.set(jid, "linklock", mode === "on");

    await sock.sendMessage(jid, {
      text:
        "╭─〔 LINKLOCK 〕\n" +
        "├ Status: " + mode.toUpperCase() + "\n" +
        "╰────────────────"
    });
  }
};
