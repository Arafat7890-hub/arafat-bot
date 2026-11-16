const { isGroupAdmin } = require("../lib/groupFeatureHelpers");

module.exports = {
  name: "setclose",
  aliases: ["close"],
  category: "GROUP",
  description: "Close group chat",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    if (!jid?.endsWith("@g.us")) {
      return sock.sendMessage(jid, {
        text: "❌ Group only."
      });
    }

    if (!(await isGroupAdmin(sock, jid, msg))) {
      return sock.sendMessage(jid, {
        text: "❌ Only group admins can close the group."
      });
    }

    try {
      await sock.groupSettingUpdate(jid, "announcement");

      await sock.sendMessage(jid, {
        text:
          "🔒 𝗚𝗥𝗢𝗨𝗣 𝗖𝗟𝗢𝗦𝗘𝗗\n\n" +
          "Only admins can send messages now."
      });
    } catch (e) {
      await sock.sendMessage(jid, {
        text: "❌ Failed to close group. Make sure bot is admin."
      });
    }
  }
};
