module.exports={
  name:"addmode",
  aliases:["memberaddmode"],
  category:"Group",
  description:"Control who can add members",
  async execute(sock,msg,args){
    const jid=msg.key.remoteJid;
    if(!jid?.endsWith("@g.us"))return sock.sendMessage(jid,{text:"❌ শুধু Group-এ ব্যবহার করা যাবে।"});
    const mode=(args[0]||"").toLowerCase();
    if(!["admin","all"].includes(mode))return sock.sendMessage(jid,{text:"❌ Use: `.addmode admin|all`"});
    try{
      await sock.groupMemberAddMode(jid,mode==="admin"?"admin_add":"all_member_add");
      await sock.sendMessage(jid,{text:`✅ Member add mode: ${mode}`});
    }catch(e){await sock.sendMessage(jid,{text:"❌ Failed: "+e.message});}
  }
};
