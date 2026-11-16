module.exports={name:"lower",aliases:["lower2"],category:"Text",description:"Lowercase text",async execute(sock,msg,args){
const jid=msg.key.remoteJid; const t=args.join(" "); await sock.sendMessage(jid,{text:t?t.toLowerCase():"❌ Text দাও।"});
}};
