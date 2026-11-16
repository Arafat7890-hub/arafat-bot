module.exports = {
  name: "unmute",
  aliases: ["groupunmute"],
  category: "Group",
  description: "Allow everyone to send messages",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    const { getGroupAdmin } = require("../lib/groupAdmin");
    const { isAdmin } = await getGroupAdmin(sock, jid);

    if (!isAdmin) {
      return sock.sendMessage(jid, {
        text: "❌ শুধু Group Admin এই command ব্যবহার করতে পারবে।"
      });
    }


    if (!jid?.endsWith("@g.us")) return sock.sendMessage(jid, {
      text: "❌ এই command শুধু Group-এ ব্যবহার করা যাবে।"
    });

    try {
      await sock.groupSettingUpdate(jid, "not_announcement");
      await sock.sendMessage(jid, {
        text: "🔊 𝗚𝗥𝗢𝗨𝗣 𝗨𝗡𝗠𝗨𝗧𝗘𝗗\n\nএখন সবাই message পাঠাতে পারবে।"
      });
    } catch (e) {
      console.log("❌ Unmute error:", e.message);
      await sock.sendMessage(jid, {
        text: "❌ Group unmute করা যায়নি। Bot-এর Admin permission check করো।"
      });
    }
  }
};
