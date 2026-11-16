module.exports = {
  name: "admincount",
  aliases: ["acount", "totaladmins"],
  category: "Group",
  description: "Show admin count",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    if (!jid?.endsWith("@g.us"))
      return sock.sendMessage(jid,{text:"❌ এই command শুধু Group-এ ব্যবহার করা যাবে।"});

    try {
      const meta = await sock.groupMetadata(jid);

      const count = (meta.participants || []).filter(p =>
        p.admin === "admin" ||
        p.admin === "superadmin" ||
        p.isAdmin ||
        p.isSuperAdmin
      ).length;

      return sock.sendMessage(jid,{
        text:`╭──〔 𝗔𝗗𝗠𝗜𝗡 𝗖𝗢𝗨𝗡𝗧 〕──╮
│
├─ 𝗔ᴅᴍɪɴs : ${count}
│
╰──────────────────────╯`
      });
    } catch(e) {
      return sock.sendMessage(jid,{text:`❌ Error: ${e.message}`});
    }
  }
};
