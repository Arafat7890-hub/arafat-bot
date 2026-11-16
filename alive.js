module.exports={
  name:"alive",
  aliases:["online"],
  category:"Info",
  description:"Check bot online status",

  async execute(sock,msg){
    await sock.sendMessage(msg.key.remoteJid,{
      text:`╭┈───〔 —͟͞͞𝗔ʀᴀꜰᴀᴛㅤBbz ᥫ᭡፝֟ 〕┈───⊷
├✦ Status: Online
├✦ System: Active
├✦ Response: Ready
╰───────────────────⊷

╭┈───〔 𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗥 〕┈───⊷
├✦ Powered By: —͟͞͞𝗔ʀᴀꜰᴀᴛㅤBbz ᥫ᭡፝֟
╰───────────────────⊷`
    });
  }
};
