module.exports={
  name:"archive",
  aliases:["archivechat"],
  category:"Chat",
  description:"Archive current chat",
  async execute(sock,msg){
    const jid=msg.key.remoteJid;
    try{
      await sock.chatModify({archive:true},jid);
      await sock.sendMessage(jid,{text:"📦 Chat archived."});
    }catch(e){
      await sock.sendMessage(jid,{text:"❌ Archive failed: "+e.message});
    }
  }
};
