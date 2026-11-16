module.exports = {
  name: "demote",
  aliases: ["admindown"],
  category: "Group",
  description: "Demote an admin to member",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    if (!jid || !jid.endsWith("@g.us")) {
      return sock.sendMessage(jid, {
        text: "❌ এই command শুধু WhatsApp Group-এ ব্যবহার করা যাবে।"
      });
    }

    const context = msg.message?.extendedTextMessage?.contextInfo;
    const target = context?.participant;

    if (!target) {
      return sock.sendMessage(jid, {
        text: "⚠️ যাকে demote করতে চাও, তার message reply করে `.demote` দাও।"
      });
    }

    try {
      const metadata = await sock.groupMetadata(jid);

      const botId = sock.user?.id?.split(":")[0];
      const botParticipant = metadata.participants.find(
        p => p.id.split("@")[0].split(":")[0] === botId
      );

      if (!botParticipant?.admin) {
        return sock.sendMessage(jid, {
          text: "❌ Bot-কে আগে Group Admin করতে হবে।"
        });
      }

      const targetInfo = metadata.participants.find(
        p => p.id === target
      );

      if (!targetInfo) {
        return sock.sendMessage(jid, {
          text: "❌ এই member group-এ নেই।"
        });
      }

      if (!targetInfo.admin) {
        return sock.sendMessage(jid, {
          text: "⚠️ এই member Admin নয়।"
        });
      }

      await sock.groupParticipantsUpdate(
        jid,
        [target],
        "demote"
      );

      await sock.sendMessage(jid, {
        text: `✅ @${target.split("@")[0]}-কে Admin থেকে demote করা হয়েছে।`,
        mentions: [target]
      });

    } catch (e) {
      console.log("❌ Demote error:", e.message);

      await sock.sendMessage(jid, {
        text: "❌ Demote করা যায়নি। Bot-এর Admin permission check করো।"
      });
    }
  }
};
