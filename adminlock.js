const { isGroupAdmin } = require("../lib/groupFeatureHelpers");

module.exports = {
  name: "adminlock",
  aliases: ["locksettings"],
  category: "ADMIN",
  description: "Lock group settings to admins",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    if (!jid?.endsWith("@g.us")) {
      return sock.sendMessage(jid, {
        text: "❌ Group only."
      });
    }

    if (!(await isGroupAdmin(sock, jid, msg))) {
      return sock.sendMessage(jid, {
        text: "❌ Only admins can use this."
      });
    }

    try {
      await sock.groupSettingUpdate(jid, "locked");

      await sock.sendMessage(jid, {
        text:
          "🔐 𝗔𝗗𝗠𝗜𝗡 𝗟𝗢𝗖𝗞\n\n" +
          "Group settings are now admin-only."
      });
    } catch {
      await sock.sendMessage(jid, {
        text: "❌ Failed. Make sure bot is admin."
      });
    }
  }
};
