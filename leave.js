module.exports = {
  name: "leave",
  aliases: ["exit"],
  category: "Owner",
  description: "Leave current group",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    if (!jid.endsWith("@g.us")) {
      return sock.sendMessage(jid, {
        text: "❌ এই command শুধু Group-এ ব্যবহার করা যাবে।"
      });
    }

    await sock.sendMessage(jid, {
      text: "👋 𝗟𝗘𝗔𝗩𝗜𝗡𝗚...\n\nBot is leaving this group."
    });

    await new Promise(r => setTimeout(r, 1200));
    await sock.groupLeave(jid);
  }
};
