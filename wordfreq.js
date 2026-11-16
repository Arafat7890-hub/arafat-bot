module.exports={name:"wordfreq",aliases:["wf"],category:"Text",description:"Word frequency",async execute(sock,msg,args){
const jid=msg.key.remoteJid,t=args.join(" ").toLowerCase().match(/\S+/g)||[];
const m={}; for(const w of t)m[w]=(m[w]||0)+1;
await sock.sendMessage(jid,{text:Object.entries(m).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k}: ${v}`).join("\n")||"❌ No words"});
}};
