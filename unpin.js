module.exports={
  name:"unpin",
  aliases:["unpinmsg"],
  category:"Message",
  description:"Unpin a replied message",
  async execute(sock,msg){
    const jid=msg.key.remoteJid;
    const c=msg.message?.extendedTextMessage?.contextInfo;
    if(!c?.stanzaId) return sock.sendMessage(jid,{text:"❌ যে message unpin করতে চাও সেটায় reply করো।"});
    try{
      await sock.sendMessage(jid,{
        pin:{
          key:{
            remoteJid:jid,
            id:c.stanzaId,
            participant:c.participant,
            fromMe:false
          },
          type:2
        }
      });
    }catch(e){
      await sock.sendMessage(jid,{text:"❌ Unpin failed: "+e.message});
    }
  }
};
