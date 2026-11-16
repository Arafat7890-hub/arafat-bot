module.exports={
  name:"markread",
  aliases:["readchat"],
  category:"Chat",
  description:"Mark current chat as read",
  async execute(sock,msg){
    const jid=msg.key.remoteJid;
    try{
      await sock.readMessages([msg.key]);
      await sock.sendMessage(jid,{text:"✅ Chat marked as read."});
    }catch(e){await sock.sendMessage(jid,{text:"❌ Failed: "+e.message});}
  }
};
