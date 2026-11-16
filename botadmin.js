const { jidNormalizedUser } = require("@whiskeysockets/baileys");

module.exports = {
  name: "botadmin",
  aliases: ["isbotadmin"],
  category: "Group",
  description: "Check bot admin status",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    if (!jid?.endsWith("@g.us"))
      return sock.sendMessage(jid,{text:"❌ এই command শুধু Group-এ ব্যবহার করা যাবে।"});

    try {
      const meta = await sock.groupMetadata(jid);
      const me = jidNormalizedUser(sock.user?.id || "");

      const bot = (meta.participants || []).find(p =>
        jidNormalizedUser(p.id || "") === me ||
        jidNormalizedUser(p.phoneNumber || "") === me
      );

      const isAdmin =
        !!bot &&
        (
          bot.admin === "admin" ||
          bot.admin === "superadmin" ||
          bot.isAdmin ||
          bot.isSuperAdmin
        );

      return sock.sendMessage(jid,{
        text:`╭──〔 𝗕𝗢𝗧 𝗔𝗗𝗠𝗜𝗡 〕──╮
│
├─ 𝗦ᴛᴀᴛᴜs : ${isAdmin ? "YES ✓" : "NO ✗"}
├─ 𝗥ᴏʟᴇ   : ${
  bot?.admin === "superadmin" || bot?.isSuperAdmin
    ? "Owner"
    : isAdmin ? "Admin" : "Member"
}
│
╰────────────────────╯`
      });
    } catch(e) {
      return sock.sendMessage(jid,{text:`❌ Error: ${e.message}`});
    }
  }
};
