module.exports={
  name:"read",
  aliases:["readmsg"],
  category:"Message",
  description:"Mark replied message as read",
  async execute(sock,msg){
    const jid=msg.key.remoteJid;
    const c=msg.message?.extendedTextMessage?.contextInfo;
    if(!c?.stanzaId) return sock.sendMessage(jid,{text:"❌ আগে message-এ reply করো।"});
    try{
      await sock.readMessages([{
        remoteJid:jid,
        id:c.stanzaId,
        participant:c.participant,
        fromMe:false
      }]);
      await sock.sendMessage(jid,{text:"✅ Message read করা হয়েছে।"});
    }catch(e){
      await sock.sendMessage(jid,{text:"❌ Read failed: "+e.message});
    }
  }
};
