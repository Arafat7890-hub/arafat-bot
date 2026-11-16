module.exports={name:"channelunfollow",aliases:["unfollowchannel"],category:"Channel",description:"Unfollow channel",async execute(sock,msg,args){
const jid=msg.key.remoteJid,c=args[0];if(!c)return sock.sendMessage(jid,{text:"❌ Channel JID দাও।"});
try{await sock.newsletterUnfollow(c);await sock.sendMessage(jid,{text:"✅ Channel unfollowed."})}catch(e){await sock.sendMessage(jid,{text:"❌ "+e.message})}
}};
