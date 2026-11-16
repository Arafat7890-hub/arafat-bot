module.exports={
  name:"revokeinvite",
  aliases:["resetlink"],
  category:"Group",
  description:"Reset group invite link",
  async execute(sock,msg){
    const jid=msg.key.remoteJid;
    if(!jid?.endsWith("@g.us"))
      return sock.sendMessage(jid,{text:"❌ শুধু Group-এ ব্যবহার করা যাবে।"});
    try{
      const code=await sock.groupRevokeInvite(jid);
      await sock.sendMessage(jid,{
        text:`🔄 *INVITE LINK RESET*\n\nhttps://chat.whatsapp.com/${code}\n\nপুরোনো invite link আর কাজ করবে না।`
      });
    }catch(e){
      await sock.sendMessage(jid,{text:"❌ Link reset failed: "+e.message});
    }
  }
};
