module.exports={
  name:"setbio",
  aliases:["setstatus"],
  category:"Profile",
  description:"Update bot profile status",
  async execute(sock,msg,args){
    const jid=msg.key.remoteJid;
    const text=args.join(" ").trim();
    if(!text)return sock.sendMessage(jid,{text:"❌ Use: `.setbio Your status`"});
    try{
      await sock.updateProfileStatus(text);
      await sock.sendMessage(jid,{text:"✅ Profile status updated."});
    }catch(e){
      await sock.sendMessage(jid,{text:"❌ Failed: "+e.message});
    }
  }
};
