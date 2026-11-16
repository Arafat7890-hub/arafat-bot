module.exports={name:"channelunmute",aliases:["unmutec"],category:"Channel",description:"Unmute channel",async execute(sock,msg,args){
const jid=msg.key.remoteJid,c=args[0];if(!c)return sock.sendMessage(jid,{text:"❌ Channel JID দাও।"});
try{await sock.newsletterUnmute(c);await sock.sendMessage(jid,{text:"🔔 Channel unmuted."})}catch(e){await sock.sendMessage(jid,{text:"❌ "+e.message})}
}};
