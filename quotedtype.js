module.exports={name:"quotedtype",aliases:["qtype"],category:"Utility",description:"Detect quoted message type",async execute(sock,msg){
const jid=msg.key.remoteJid,q=msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
if(!q)return sock.sendMessage(jid,{text:"❌ কোনো quoted message নেই।"});
const type=Object.keys(q)[0]||"unknown";
await sock.sendMessage(jid,{text:`↩️ QUOTED TYPE\n\n${type}`});
}};
