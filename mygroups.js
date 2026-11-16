module.exports = {
  name: "mygroups",
  aliases: ["groups", "allgroups", "groupids"],
  category: "Info",
  description: "List all WhatsApp groups of the connected account",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    // Only allow from private/inbox chat
    if (!jid || jid.endsWith("@g.us")) {
      return sock.sendMessage(jid, {
        text: "❌ এই command শুধু Inbox/Private chat-এ ব্যবহার করুন।"
      });
    }

    try {
      const groups = await sock.groupFetchAllParticipating();
      const list = Object.values(groups || {});

      if (!list.length) {
        return sock.sendMessage(jid, {
          text: "📭 এই account-এ কোনো participating group পাওয়া যায়নি।"
        });
      }

      const lines = list.map((group, index) => {
        const name = group.subject || "Unnamed Group";
        const id = group.id || "Unknown ID";

        return `┃ ${index + 1}. ${name}\n┃    🆔 ${id}`;
      });

      const text = `╭━━━〔 👥 𝗠𝗬 𝗚𝗥𝗢𝗨𝗣𝗦 〕━━━╮
┃
┃ 📊 Total Groups : ${list.length}
┃
${lines.join("\n┃\n")}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`;

      await sock.sendMessage(jid, { text });

    } catch (error) {
      console.log("MYGROUPS ERROR:", error.message);

      await sock.sendMessage(jid, {
        text: "❌ Group list পাওয়া যায়নি.\n\nError: " + error.message
      });
    }
  }
};
