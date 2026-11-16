const { isGroupAdmin } = require("../lib/groupFeatureHelpers");

module.exports = {
  name: "adminremovelock",
  aliases: ["unlocksettings"],
  category: "ADMIN",
  description: "Unlock group settings",

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
      await sock.groupSettingUpdate(jid, "unlocked");

      await sock.sendMessage(jid, {
        text:
          "🔓 𝗔𝗗𝗠𝗜𝗡 𝗟𝗢𝗖𝗞 𝗥𝗘𝗠𝗢𝗩𝗘𝗗\n\n" +
          "Group settings are unlocked."
      });
    } catch {
      await sock.sendMessage(jid, {
        text: "❌ Failed. Make sure bot is admin."
      });
    }
  }
};
