const sessionManager = require("../lib/sessionManager");

module.exports = {
  name: "slot",
  aliases: ["slotinfo"],
  category: "System",
  description: "Show session slot details",

  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const id = String(args?.[0] || "1");

    const slot = sessionManager.getSlot(id);

    if (!slot) {
      return sock.sendMessage(jid, {
        text: `❌ Slot ${id} পাওয়া যায়নি।`
      });
    }

    const text =
`╭──〔 𝗦𝗟𝗢𝗧 ${id} 〕──╮
│
├─ 𝗜ᴅ         : ${slot.id}
├─ 𝗦ᴛᴀᴛᴜs     : ${slot.status}
├─ 𝗖ʀᴇᴀᴛᴇᴅ   : ${new Date(slot.createdAt).toLocaleString()}
├─ 𝗨ᴘᴅᴀᴛᴇᴅ   : ${new Date(slot.updatedAt).toLocaleString()}
│
╰────────────────────╯`;

    return sock.sendMessage(jid, { text });
  }
};
