module.exports={name:"mentioncount",aliases:["mentions"],category:"Utility",description:"Count mentions",async execute(sock,msg){
const jid=msg.key.remoteJid,c=msg.message?.extendedTextMessage?.contextInfo;
await sock.sendMessage(jid,{text:`🏷️ Mentions: ${(c?.mentionedJid||[]).length}`});
}};
