module.exports = {
  name: "link",
  aliases: ["grouplink"],
  category: "Group",
  description: "Get group invite link",

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
      const code = await sock.groupInviteCode(jid);
      if (!code) throw new Error("No invite code");

      await sock.sendMessage(jid, {
        text: `🔗 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗩𝗜𝗧𝗘 𝗟𝗜𝗡𝗞\n\nhttps://chat.whatsapp.com/${code}`
      });
    } catch (e) {
      console.log("❌ Link error:", e.message);
      await sock.sendMessage(jid, {
        text: "❌ Group invite link পাওয়া যায়নি।"
      });
    }
  }
};
