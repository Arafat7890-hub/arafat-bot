module.exports={
  name:"unkeep",
  aliases:["unkeepmsg"],
  category:"Message",
  description:"Remove keep from a message",
  async execute(sock,msg){
    const jid=msg.key.remoteJid;
    const c=msg.message?.extendedTextMessage?.contextInfo;
    if(!c?.stanzaId)return sock.sendMessage(jid,{text:"❌ আগে message-এ reply করো।"});
    try{
      await sock.sendMessage(jid,{
        keep:{
          key:{remoteJid:jid,id:c.stanzaId,participant:c.participant,fromMe:false},
          type:2
        }
      });
      await sock.sendMessage(jid,{text:"📌 Message unkept."});
    }catch(e){await sock.sendMessage(jid,{text:"❌ Unkeep failed: "+e.message});}
  }
};
