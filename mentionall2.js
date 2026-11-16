module.exports={
  name:"mentionall2",
  aliases:["everyone"],
  category:"Group",
  description:"Mention all group members",
  async execute(sock,msg){
    const jid=msg.key.remoteJid;
    if(!jid?.endsWith("@g.us"))return sock.sendMessage(jid,{text:"❌ শুধু Group-এ ব্যবহার করা যাবে।"});
    try{
      await sock.sendMessage(jid,{
        text:"📢 Everyone",
        mentionAll:true
      });
    }catch(e){await sock.sendMessage(jid,{text:"❌ Mention failed: "+e.message});}
  }
};
