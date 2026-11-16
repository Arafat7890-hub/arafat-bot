module.exports={
  name:"mutechat",
  aliases:["chatmute"],
  category:"Chat",
  description:"Mute current chat",
  async execute(sock,msg,args){
    const jid=msg.key.remoteJid;
    const value=(args[0]||"8h").toLowerCase();
    const map={["8h"]:28800000,["1d"]:86400000,["7d"]:604800000,["forever"]:0};
    if(!(value in map))return sock.sendMessage(jid,{text:"❌ Use: `.mutechat 8h|1d|7d|forever`"});
    try{
      await sock.chatModify({mute:map[value]},jid);
      await sock.sendMessage(jid,{text:`🔕 Chat muted: ${value}`});
    }catch(e){await sock.sendMessage(jid,{text:"❌ Failed: "+e.message});}
  }
};
