module.exports={
  name:"star",
  aliases:["starmsg"],
  category:"Message",
  description:"Star a replied message",
  async execute(sock,msg){
    const jid=msg.key.remoteJid;
    const c=msg.message?.extendedTextMessage?.contextInfo;
    if(!c?.stanzaId)return sock.sendMessage(jid,{text:"❌ আগে message-এ reply করো।"});
    try{
      await sock.star(jid,[{
        id:c.stanzaId,
        participant:c.participant,
        fromMe:false
      }],true);
      await sock.sendMessage(jid,{text:"⭐ Message starred."});
    }catch(e){
      await sock.sendMessage(jid,{text:"❌ Star failed: "+e.message});
    }
  }
};
