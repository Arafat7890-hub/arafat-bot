const protection = require("../lib/protection");

function isGroup(msg) {
  return msg.key.remoteJid?.endsWith("@g.us");
}

function isAdmin(meta, id) {
  const p = meta.participants.find(x => x.id === id);
  return !!p?.admin;
}

module.exports = {
  name: "protection",
  aliases: ["protect", "protectionstatus"],
  category: "Group",
  description: "Show group protection status",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    if (!isGroup(msg)) {
      return sock.sendMessage(jid, {
        text: "❌ এই command শুধু Group-এ ব্যবহার করা যাবে।"
      });
    }

    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || jid;

    if (!isAdmin(meta, sender)) {
      return sock.sendMessage(jid, {
        text: "❌ শুধু Group Admin এই command ব্যবহার করতে পারবে।"
      });
    }

    const c = protection.get(jid);

    const text = `╭━━━〔 🛡️ 𝗣𝗥𝗢𝗧𝗘𝗖𝗧𝗜𝗢𝗡 〕━━━╮
┃
┃ 🌊 AntiFlood   : ${c.antiflood ? "🟢 ON" : "🔴 OFF"}
┃ 🚨 AntiRaid    : ${c.antiraid ? "🟢 ON" : "🔴 OFF"}
┃ 🚫 AntiBadword : ${c.antibadword ? "🟢 ON" : "🔴 OFF"}
┃
┃ 📝 Badwords    : ${c.badwords.length}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`;

    await sock.sendMessage(jid, { text });
  }
};
