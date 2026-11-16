module.exports={name:"title",aliases:["titlecase2"],category:"Text",description:"Title case text",async execute(sock,msg,args){
const jid=msg.key.remoteJid,t=args.join(" ").trim();
if(!t)return sock.sendMessage(jid,{text:"❌ Text দাও।"});
await sock.sendMessage(jid,{text:t.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase())});
}};
