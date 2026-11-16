module.exports={
  name:"pin",
  aliases:["pinmsg"],
  category:"Message",
  description:"Pin a replied message",
  async execute(sock,msg){
    const jid=msg.key.remoteJid;
    const c=msg.message?.extendedTextMessage?.contextInfo;
    if(!c?.stanzaId) return sock.sendMessage(jid,{text:"❌ যে message pin করতে চাও সেটায় reply করো।"});
    try{
      await sock.sendMessage(jid,{
        pin:{
          key:{
            remoteJid:jid,
            id:c.stanzaId,
            participant:c.participant,
            fromMe:false
          },
          type:1,
          time:86400
        }
      });
    }catch(e){
      await sock.sendMessage(jid,{text:"❌ Pin failed: "+e.message});
    }
  }
};
