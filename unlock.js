module.exports = {
  name: "unlock",
  aliases: ["opengc"],
  category: "Group",
  description: "Allow everyone to send messages",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    if (!jid || !jid.endsWith("@g.us")) {
      return sock.sendMessage(jid, {
        text: "❌ এই command শুধু WhatsApp Group-এ ব্যবহার করা যাবে।"
      });
    }

    try {
      const metadata = await sock.groupMetadata(jid);

      const botJid = sock.user?.id;
      const botNumber = botJid?.split(":")[0];

      const bot = (metadata.participants || []).find(p => {
        const phone = p.phoneNumber?.split("@")[0];
        const id = p.id?.split("@")[0];

        return (
          (phone === botNumber || id === botNumber) &&
          p.admin
        );
      });

      if (!bot?.admin) {
        return sock.sendMessage(jid, {
          text: "❌ Bot-কে আগে Group Admin করতে হবে।"
        });
      }

      await sock.groupSettingUpdate(jid, "not_announcement");

      await sock.sendMessage(jid, {
        text: "🔓 𝗚𝗥𝗢𝗨𝗣 𝗨𝗡𝗟𝗢𝗖𝗞𝗘𝗗\n\nএখন সবাই message পাঠাতে পারবে।"
      });

    } catch (e) {
      console.log("❌ Unlock error:", e.message);

      await sock.sendMessage(jid, {
        text: "❌ Group unlock করা যায়নি।"
      });
    }
  }
};
