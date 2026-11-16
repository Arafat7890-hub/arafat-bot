module.exports={name:"communityrevoke",aliases:["crevoke"],category:"Community",description:"Revoke community invite",async execute(sock,msg){
const jid=msg.key.remoteJid;try{await sock.communityRevokeInvite(jid);await sock.sendMessage(jid,{text:"✅ Community invite revoked."})}catch(e){await sock.sendMessage(jid,{text:"❌ "+e.message})}
}};
