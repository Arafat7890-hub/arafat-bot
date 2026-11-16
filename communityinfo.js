module.exports={name:"communityinfo",aliases:["cinfo"],category:"Community",description:"Community information",async execute(sock,msg){
const jid=msg.key.remoteJid;if(!jid?.endsWith("@g.us"))return sock.sendMessage(jid,{text:"❌ Community JID দরকার।"});
try{const r=await sock.communityMetadata(jid);await sock.sendMessage(jid,{text:`🏘️ COMMUNITY\n\nName: ${r.subject||"Unknown"}\nID: ${r.id||jid}`})}catch(e){await sock.sendMessage(jid,{text:"❌ "+e.message})}
}};
