module.exports={
  name:"repeat",
  aliases:["sayagain"],
  category:"Utility",
  description:"Repeat text",
  async execute(sock,msg,args){
    const jid=msg.key.remoteJid;
    const text=args.join(" ").trim();
    if(!text)return sock.sendMessage(jid,{text:"❌ Text দাও।"});
    await sock.sendMessage(jid,{text});
  }
};
