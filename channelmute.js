module.exports={name:"channelmute",aliases:["mutec"],category:"Channel",description:"Mute channel",async execute(sock,msg,args){
const jid=msg.key.remoteJid,c=args[0];if(!c)return sock.sendMessage(jid,{text:"❌ Channel JID দাও।"});
try{await sock.newsletterMute(c);await sock.sendMessage(jid,{text:"🔕 Channel muted."})}catch(e){await sock.sendMessage(jid,{text:"❌ "+e.message})}
}};
