module.exports={name:"charfreq",aliases:["frequency"],category:"Text",description:"Character frequency",async execute(sock,msg,args){
const jid=msg.key.remoteJid,t=args.join(" ");
if(!t)return sock.sendMessage(jid,{text:"❌ Text দাও।"});
const m={}; for(const c of t.toLowerCase()){if(c.trim())m[c]=(m[c]||0)+1}
await sock.sendMessage(jid,{text:Object.entries(m).map(([k,v])=>`${k}: ${v}`).join("\n")});
}};
