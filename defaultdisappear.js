module.exports={name:"defaultdisappear",aliases:["defaultdm"],category:"Privacy",description:"Set default disappearing duration",async execute(sock,msg,args){
const jid=msg.key.remoteJid;const m={off:0,"24h":86400,"7d":604800,"90d":7776000},v=m[(args[0]||"").toLowerCase()];
if(v===undefined)return sock.sendMessage(jid,{text:"❌ Use: .defaultdisappear off|24h|7d|90d"});
try{await sock.updateDefaultDisappearingMode(v);await sock.sendMessage(jid,{text:`✅ Default disappearing: ${args[0]}`})}catch(e){await sock.sendMessage(jid,{text:"❌ "+e.message})}
}};
