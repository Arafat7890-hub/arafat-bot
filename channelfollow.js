module.exports={name:"channelfollow",aliases:["followchannel"],category:"Channel",description:"Follow channel",async execute(sock,msg,args){
const jid=msg.key.remoteJid,c=args[0];if(!c)return sock.sendMessage(jid,{text:"❌ Channel JID দাও।"});
try{await sock.newsletterFollow(c);await sock.sendMessage(jid,{text:"✅ Channel followed."})}catch(e){await sock.sendMessage(jid,{text:"❌ "+e.message})}
}};
