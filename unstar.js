module.exports={
  name:"unstar",
  aliases:["unstarmsg"],
  category:"Message",
  description:"Unstar a replied message",
  async execute(sock,msg){
    const jid=msg.key.remoteJid;
    const c=msg.message?.extendedTextMessage?.contextInfo;
    if(!c?.stanzaId)return sock.sendMessage(jid,{text:"❌ আগে message-এ reply করো।"});
    try{
      await sock.star(jid,[{
        id:c.stanzaId,
        participant:c.participant,
        fromMe:false
      }],false);
      await sock.sendMessage(jid,{text:"☆ Message unstarred."});
    }catch(e){
      await sock.sendMessage(jid,{text:"❌ Unstar failed: "+e.message});
    }
  }
};
