module.exports={name:"wordcount2",aliases:["words"],category:"Text",description:"Count words",async execute(sock,msg,args){
const jid=msg.key.remoteJid,t=args.join(" ").trim();
if(!t)return sock.sendMessage(jid,{text:"❌ Text দাও।"});
await sock.sendMessage(jid,{text:`🔢 Words: ${t.split(/\s+/).length}`});
}};
