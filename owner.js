module.exports = {
  name: "owner",
  aliases: ["groupowner", "gowner"],
  category: "Group",
  description: "Show group owner",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    if (!jid?.endsWith("@g.us"))
      return sock.sendMessage(jid,{text:"❌ এই command শুধু Group-এ ব্যবহার করা যাবে।"});

    try {
      const meta = await sock.groupMetadata(jid);

      const owner = String(
        meta.ownerPn ||
        meta.owner ||
        meta.subjectOwnerPn ||
        meta.subjectOwner ||
        ""
      ).split("@")[0].split(":")[0].replace(/\D/g,"");

      return sock.sendMessage(jid,{
        text:`╭──〔 𝗚𝗥𝗢𝗨𝗣 𝗢𝗪𝗡𝗘𝗥 〕──╮
│
├─ 𝗡ᴜᴍʙᴇʀ : ${owner || "Unknown"}
│
╰──────────────────────╯`
      });
    } catch(e) {
      return sock.sendMessage(jid,{text:`❌ Error: ${e.message}`});
    }
  }
};
