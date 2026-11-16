module.exports={name:"channeldelete",aliases:["deletechannel"],category:"Channel",description:"Delete owned channel",async execute(sock,msg,args){
const jid=msg.key.remoteJid,c=args[0];if(!c)return sock.sendMessage(jid,{text:"❌ Channel JID দাও।"});
try{await sock.newsletterDelete(c);await sock.sendMessage(jid,{text:"✅ Channel deleted."})}catch(e){await sock.sendMessage(jid,{text:"❌ "+e.message})}
}};
