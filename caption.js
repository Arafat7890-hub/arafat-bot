module.exports={
  name:"caption",
  aliases:["cap"],
  category:"Media",
  description:"Show replied media caption",
  async execute(sock,msg){
    const jid=msg.key.remoteJid;
    const q=msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if(!q)return sock.sendMessage(jid,{text:"❌ আগে media-তে reply করো।"});
    const caption=q.imageMessage?.caption||q.videoMessage?.caption||q.documentMessage?.caption;
    await sock.sendMessage(jid,{text:caption?`📝 ${caption}`:"❌ এই media-তে কোনো caption নেই।"});
  }
};
