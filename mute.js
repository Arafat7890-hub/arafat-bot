module.exports = {
  name: "mute",
  aliases: ["groupmute"],
  category: "Group",
  description: "Allow only admins to send messages",

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
      await sock.groupSettingUpdate(jid, "announcement");
      await sock.sendMessage(jid, {
        text: "🔇 𝗚𝗥𝗢𝗨𝗣 𝗠𝗨𝗧𝗘𝗗\n\nএখন শুধু Admin-রা message পাঠাতে পারবে।"
      });
    } catch (e) {
      console.log("❌ Mute error:", e.message);
      await sock.sendMessage(jid, {
        text: "❌ Group mute করা যায়নি। Bot-এর Admin permission check করো।"
      });
    }
  }
};
