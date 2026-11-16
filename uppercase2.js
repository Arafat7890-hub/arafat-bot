module.exports={name:"upper",aliases:["upper2"],category:"Text",description:"Uppercase text",async execute(sock,msg,args){
const jid=msg.key.remoteJid; const t=args.join(" "); await sock.sendMessage(jid,{text:t?t.toUpperCase():"❌ Text দাও।"});
}};
