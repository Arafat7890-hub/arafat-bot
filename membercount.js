module.exports = {
  name: "membercount",
  aliases: ["members", "mcount"],
  category: "Group",
  description: "Show member count",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    if (!jid?.endsWith("@g.us"))
      return sock.sendMessage(jid,{text:"❌ এই command শুধু Group-এ ব্যবহার করা যাবে।"});

    try {
      const meta = await sock.groupMetadata(jid);

      return sock.sendMessage(jid,{
        text:`╭──〔 𝗠𝗘𝗠𝗕𝗘𝗥 𝗖𝗢𝗨𝗡𝗧 〕──╮
│
├─ 𝗠ᴇᴍʙᴇʀs : ${meta.size ?? meta.participants?.length ?? 0}
│
╰────────────────────────╯`
      });
    } catch(e) {
      return sock.sendMessage(jid,{text:`❌ Error: ${e.message}`});
    }
  }
};
