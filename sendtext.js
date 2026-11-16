module.exports={
  name:"sendtext",
  aliases:["stext"],
  category:"Utility",
  description:"Send formatted text",
  async execute(sock,msg,args){
    const jid=msg.key.remoteJid;
    const text=args.join(" ").trim();
    if(!text)return sock.sendMessage(jid,{text:"❌ Text দাও।"});
    await sock.sendMessage(jid,{text},{quoted:msg});
  }
};
