module.exports={name:"sortwords",aliases:["alphabetwords"],category:"Text",description:"Sort words alphabetically",async execute(sock,msg,args){
const jid=msg.key.remoteJid,t=args.join(" ");
if(!t)return sock.sendMessage(jid,{text:"❌ Text দাও।"});
await sock.sendMessage(jid,{text:t.split(/\s+/).sort((a,b)=>a.localeCompare(b)).join(" ")});
}};
