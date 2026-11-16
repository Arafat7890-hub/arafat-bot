module.exports={name:"communityjoin",aliases:["cjoin"],category:"Community",description:"Join community by invite",async execute(sock,msg,args){
const jid=msg.key.remoteJid,c=(args[0]||"").split("/").pop();if(!c)return sock.sendMessage(jid,{text:"❌ Invite code/link দাও।"});
try{const r=await sock.communityAcceptInvite(c);await sock.sendMessage(jid,{text:`✅ Joined community.\n${r||""}`})}catch(e){await sock.sendMessage(jid,{text:"❌ "+e.message})}
}};
