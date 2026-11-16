module.exports = {
  name: "promote",
  aliases: ["adminup"],
  category: "Group",
  description: "Promote a member to admin",

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
        text: "⚠️ যাকে admin করতে চাও, তার message reply করে `.promote` দাও।"
      });
    }

    try {
      const metadata = await sock.groupMetadata(jid);

      const botJid = sock.user?.id?.split(":")[0] + "@s.whatsapp.net";
      const botParticipant = metadata.participants.find(
        p => p.id === botJid
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

      if (targetInfo.admin) {
        return sock.sendMessage(jid, {
          text: "⚠️ এই member already Admin।"
        });
      }

      await sock.groupParticipantsUpdate(
        jid,
        [target],
        "promote"
      );

      await sock.sendMessage(jid, {
        text: `✅ @${target.split("@")[0]} এখন Group Admin হয়েছে।`,
        mentions: [target]
      });

    } catch (e) {
      console.log("❌ Promote error:", e.message);

      await sock.sendMessage(jid, {
        text: "❌ Promote করা যায়নি। Bot-এর Admin permission check করো।"
      });
    }
  }
};
