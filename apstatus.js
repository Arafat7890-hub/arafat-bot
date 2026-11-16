module.exports = {
  name: "apstatus",
  aliases: ["profilestatus"],
  category: "Owner",
  description: "Update bot profile status",

  async execute(sock, msg, args) {
    const status = args.join(" ").trim();

    if (!status) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "⚙️ Usage: .apstatus <new status>"
      });
    }

    try {
      await sock.updateProfileStatus(status);

      await sock.sendMessage(msg.key.remoteJid, {
        text: "✅ 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 𝗦𝗧𝗔𝗧𝗨𝗦\n\nUpdated successfully."
      });
    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Profile status update failed."
      });
    }
  }
};
