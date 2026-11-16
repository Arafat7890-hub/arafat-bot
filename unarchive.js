module.exports={
  name:"unarchive",
  aliases:["unarchivechat"],
  category:"Chat",
  description:"Unarchive current chat",
  async execute(sock,msg){
    const jid=msg.key.remoteJid;
    try{
      await sock.chatModify({archive:false},jid);
      await sock.sendMessage(jid,{text:"📂 Chat unarchived."});
    }catch(e){
      await sock.sendMessage(jid,{text:"❌ Unarchive failed: "+e.message});
    }
  }
};
