module.exports={name:"communitylink",aliases:["clink"],category:"Community",description:"Link group to community",async execute(sock,msg,args){
const jid=msg.key.remoteJid,c=args[0];if(!c)return sock.sendMessage(jid,{text:"❌ Community JID দাও।"});
try{await sock.communityLinkGroup(jid,c);await sock.sendMessage(jid,{text:"✅ Group linked."})}catch(e){await sock.sendMessage(jid,{text:"❌ "+e.message})}
}};
