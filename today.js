module.exports = {
  name: "today",
  aliases: ["todaydate"],
  category: "Utility",
  description: "Show today's date",

  async execute(sock, msg) {
    const date = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Dhaka",
      dateStyle: "full"
    }).format(new Date());

    await sock.sendMessage(msg.key.remoteJid, {
      text: `📅 ᴛᴏᴅᴀʏ\n\n➤ ${date}\n🇧🇩 ʙᴀɴɢʟᴀᴅᴇsʜ`
    });
  }
};
