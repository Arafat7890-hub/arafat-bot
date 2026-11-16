const features = require("./groupFeatures");

function getNumber(user) {
  return String(user || "")
    .split("@")[0]
    .split(":")[0];
}

function registerGroupFeatureEvents(sock) {
  sock.ev.on("group-participants.update", async (update) => {
    try {
      const jid = update.id;
      const participants = update.participants || [];
      const action = update.action;

      if (!jid || !jid.endsWith("@g.us")) return;

      const cfg = features.get(jid);

      if (action === "add") {
        for (const user of participants) {
          const number = getNumber(user);

          const text = cfg.welcome2
            ? `╭━━〔 ✨ 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 〕━━╮
┃ 👤 @${number}
┃
┃ 🎉 নতুন মানুষ হাজির!
┃ 😭 এখন থেকে আড্ডার দায়
┃    তোমারও আছে!
╰━━━━━━━━━━━━━━╯`
            : `╭━━〔 👋 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 〕━━╮
┃ 👤 @${number}
┃
┃ 🎊 Welcome to the family!
┃ 😂 পালানোর আগে পরিচয় দাও!
╰━━━━━━━━━━━━━━╯`;

          if (cfg.welcome || cfg.welcome2) {
            await sock.sendMessage(jid, {
              text,
              mentions: [user]
            });
          }
        }
      }

      if (action === "remove") {
        for (const user of participants) {
          const number = getNumber(user);

          const text = cfg.goodbye2
            ? `╭━━〔 🚪 𝗚𝗢𝗢𝗗𝗕𝗬𝗘 〕━━╮
┃ 👤 @${number}
┃
┃ 🥲 চলে গেলেন!
┃ 😂 গ্রুপটা তোমাকে মিস করবে...
┃    হয়তো পাঁচ মিনিটের জন্য! 😭
╰━━━━━━━━━━━━━━╯`
            : `╭━━〔 👋 𝗚𝗢𝗢𝗗𝗕𝗬𝗘 〕━━╮
┃ 👤 @${number}
┃
┃ 😭 বিদায়!
┃ 😂 এত তাড়াতাড়ি হাল ছেড়ে দিলে?
╰━━━━━━━━━━━━━━╯`;

          if (cfg.goodbye || cfg.goodbye2) {
            await sock.sendMessage(jid, {
              text,
              mentions: [user]
            });
          }
        }
      }
    } catch (error) {
      console.log("❌ GROUP FEATURE EVENT:", error.message);
    }
  });
}

module.exports = {
  registerGroupFeatureEvents
};
