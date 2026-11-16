module.exports={
  name:"chatmuteinfo",
  aliases:["mutestatus"],
  category:"Chat",
  description:"Show chat mute information",
  async execute(sock,msg){
    const jid=msg.key.remoteJid;
    try{
      const chats=await sock.chatModify({archive:false},jid);
      await sock.sendMessage(jid,{text:"ℹ️ Chat information refreshed."});
    }catch(e){
      await sock.sendMessage(jid,{text:"ℹ️ Chat mute information is not available: "+e.message});
    }
  }
};
