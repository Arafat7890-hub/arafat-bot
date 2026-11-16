module.exports={
  name:"subject",
  aliases:["groupsubject","gcsubject"],
  category:"Group",
  description:"Change group subject",
  async execute(sock,msg,args){
    const jid=msg.key.remoteJid;
    const text=args.join(" ").trim();
    if(!jid?.endsWith("@g.us"))return sock.sendMessage(jid,{text:"❌ শুধু Group-এ ব্যবহার করা যাবে।"});
    if(!text)return sock.sendMessage(jid,{text:"❌ নতুন group name দাও।"});
    try{
      await sock.groupUpdateSubject(jid,text);
      await sock.sendMessage(jid,{text:"✅ Group name updated."});
    }catch(e){await sock.sendMessage(jid,{text:"❌ Failed: "+e.message});}
  }
};
