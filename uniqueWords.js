module.exports={name:"uniquewords",aliases:["dedupewords"],category:"Text",description:"Remove duplicate words",async execute(sock,msg,args){
const jid=msg.key.remoteJid,t=args.join(" ");
if(!t)return sock.sendMessage(jid,{text:"❌ Text দাও।"});
const out=[...new Set(t.split(/\s+/))].join(" ");
await sock.sendMessage(jid,{text:out});
}};
