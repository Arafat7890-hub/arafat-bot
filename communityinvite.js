module.exports={name:"communityinvite",aliases:["cinvite"],category:"Community",description:"Get community invite",async execute(sock,msg){
const jid=msg.key.remoteJid;try{const c=await sock.communityInviteCode(jid);await sock.sendMessage(jid,{text:`🔗 Community invite:\nhttps://chat.whatsapp.com/${c}`})}catch(e){await sock.sendMessage(jid,{text:"❌ "+e.message})}
}};
