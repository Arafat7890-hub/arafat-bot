module.exports={name:"clear",aliases:["clearmsg"],category:"Message",description:"Delete a replied message",async execute(sock,msg){
const jid=msg.key.remoteJid,c=msg.message?.extendedTextMessage?.contextInfo;
if(!c?.stanzaId)return sock.sendMessage(jid,{text:"❌ Message-এ reply করো।"});
try{await sock.sendMessage(jid,{delete:{remoteJid:jid,id:c.stanzaId,participant:c.participant,fromMe:false}})}catch(e){await sock.sendMessage(jid,{text:"❌ Failed: "+e.message})}
}};
