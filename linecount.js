module.exports={name:"linecount",aliases:["linescount"],category:"Text",description:"Count lines",async execute(sock,msg,args){
const jid=msg.key.remoteJid,t=args.join(" ");
if(!t)return sock.sendMessage(jid,{text:"❌ Text দাও।"});
await sock.sendMessage(jid,{text:`📏 Lines: ${t.split(/\r?\n/).length}`});
}};
