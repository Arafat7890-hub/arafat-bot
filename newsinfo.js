module.exports={name:"newsinfo",aliases:["channelinfo"],category:"Channel",description:"Channel information",async execute(sock,msg,args){
const jid=msg.key.remoteJid,target=args[0]||jid;
try{const r=await sock.newsletterMetadata(target);await sock.sendMessage(jid,{text:`📣 CHANNEL INFO\n\nName: ${r.name||"Unknown"}\nID: ${r.id||target}\nDescription: ${r.description||"None"}`})}catch(e){await sock.sendMessage(jid,{text:"❌ "+e.message})}
}};
