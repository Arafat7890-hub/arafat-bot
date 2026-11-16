module.exports={name:"msgcontext",aliases:["context"],category:"Utility",description:"Show quoted message context",async execute(sock,msg){
const jid=msg.key.remoteJid,c=msg.message?.extendedTextMessage?.contextInfo;
if(!c)return sock.sendMessage(jid,{text:"❌ এই message-এ context নেই।"});
await sock.sendMessage(jid,{text:`🧩 CONTEXT\n\nQuoted: ${!!c.quotedMessage}\nStanza ID: ${c.stanzaId||"N/A"}\nParticipant: ${c.participant||"N/A"}\nMentions: ${(c.mentionedJid||[]).length}`});
}};
