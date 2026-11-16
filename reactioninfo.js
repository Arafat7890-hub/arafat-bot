module.exports={name:"reactioninfo",aliases:["reactinfo"],category:"Utility",description:"Show reaction context",async execute(sock,msg){
const jid=msg.key.remoteJid;
const r=msg.message?.reactionMessage;
if(!r)return sock.sendMessage(jid,{text:"❌ এই message-এ reaction নেই।"});
await sock.sendMessage(jid,{text:`❤️ REACTION\n\nEmoji: ${r.text||"N/A"}\nMessage ID: ${r.key?.id||"N/A"}`});
}};
