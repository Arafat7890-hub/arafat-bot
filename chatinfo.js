module.exports={name:"chatinfo",aliases:["chatdetails"],category:"Info",description:"Show current chat information",async execute(sock,msg){
const jid=msg.key.remoteJid;
await sock.sendMessage(jid,{text:`💬 CHAT INFO\n\nJID: ${jid}\nType: ${jid?.endsWith("@g.us")?"Group":jid?.endsWith("@newsletter")?"Channel":"Private"}\nFrom Me: ${!!msg.key?.fromMe}`});
}};
