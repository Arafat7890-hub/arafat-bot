module.exports={name:"texttype",aliases:["detecttext"],category:"Utility",description:"Detect message text type",async execute(sock,msg){
const jid=msg.key.remoteJid,m=msg.message||{};
let type="unknown";
if(m.conversation)type="conversation";
else if(m.extendedTextMessage)type="extendedText";
else if(m.imageMessage)type="image";
else if(m.videoMessage)type="video";
else if(m.audioMessage)type="audio";
else if(m.documentMessage)type="document";
else if(m.stickerMessage)type="sticker";
else if(m.pollCreationMessage)type="poll";
await sock.sendMessage(jid,{text:`📝 MESSAGE TYPE\n\n${type}`});
}};
