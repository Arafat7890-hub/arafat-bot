module.exports={
  name:"presence",
  aliases:["online"],
  category:"Utility",
  description:"Set bot presence",
  async execute(sock,msg,args){
    const jid=msg.key.remoteJid;
    const type=(args[0]||"available").toLowerCase();
    const allowed=["available","unavailable","composing","recording","paused"];
    if(!allowed.includes(type))
      return sock.sendMessage(jid,{text:"❌ Use: `.presence available` / `.presence composing` / `.presence paused`"});
    try{
      await sock.sendPresenceUpdate(type,jid);
      await sock.sendMessage(jid,{text:`✅ Presence: ${type}`});
    }catch(e){
      await sock.sendMessage(jid,{text:"❌ Presence failed: "+e.message});
    }
  }
};
