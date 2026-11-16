module.exports={
  name:"unmutechat",
  aliases:["chatunmute"],
  category:"Chat",
  description:"Unmute current chat",
  async execute(sock,msg){
    const jid=msg.key.remoteJid;
    try{
      await sock.chatModify({mute:null},jid);
      await sock.sendMessage(jid,{text:"🔔 Chat unmuted."});
    }catch(e){await sock.sendMessage(jid,{text:"❌ Failed: "+e.message});}
  }
};
