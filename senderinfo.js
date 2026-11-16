module.exports={name:"senderinfo",aliases:["senderdetails"],category:"Info",description:"Show sender information",async execute(sock,msg){
const jid=msg.key.remoteJid;
const sender=msg.key.participant||msg.key.remoteJid;
await sock.sendMessage(jid,{text:`👤 SENDER INFO\n\nJID: ${sender||"N/A"}\nFrom Me: ${!!msg.key?.fromMe}`});
}};
