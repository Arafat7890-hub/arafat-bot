module.exports = {
  name: "remove",
  aliases: [],
  category: "Group",
  description: "Remove a replied member",

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

    const target = msg.message?.extendedTextMessage?.contextInfo?.participant;
    if (!target) return sock.sendMessage(jid, {
      text: "⚠️ যাকে remove করতে চাও তার message reply করে `.remove` দাও।"
    });

    try {
      await sock.groupParticipantsUpdate(jid, [target], "remove");
      await sock.sendMessage(jid, {
        text: `✅ @${target.split("@")[0]} group থেকে remove করা হয়েছে।`,
        mentions: [target]
      });
    } catch (e) {
      console.log("❌ Remove error:", e.message);
      await sock.sendMessage(jid, {
        text: "❌ Remove করা যায়নি। Bot-এর Admin permission check করো।"
      });
    }
  }
};
