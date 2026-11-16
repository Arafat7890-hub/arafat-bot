const { isGroupAdmin } = require("../lib/groupFeatureHelpers");

module.exports = {
  name: "setopen",
  aliases: ["open"],
  category: "GROUP",
  description: "Open group chat",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    if (!jid?.endsWith("@g.us")) {
      return sock.sendMessage(jid, {
        text: "❌ Group only."
      });
    }

    if (!(await isGroupAdmin(sock, jid, msg))) {
      return sock.sendMessage(jid, {
        text: "❌ Only group admins can open the group."
      });
    }

    try {
      await sock.groupSettingUpdate(jid, "not_announcement");

      await sock.sendMessage(jid, {
        text:
          "🔓 𝗚𝗥𝗢𝗨𝗣 𝗢𝗣𝗘𝗡𝗘𝗗\n\n" +
          "Everyone can send messages now."
      });
    } catch (e) {
      await sock.sendMessage(jid, {
        text: "❌ Failed to open group. Make sure bot is admin."
      });
    }
  }
};
