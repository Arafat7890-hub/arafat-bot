module.exports={name:"communityunlink",aliases:["cunlink"],category:"Community",description:"Unlink group",async execute(sock,msg,args){
const jid=msg.key.remoteJid,c=args[0];if(!c)return sock.sendMessage(jid,{text:"❌ Community JID দাও।"});
try{await sock.communityUnlinkGroup(jid,c);await sock.sendMessage(jid,{text:"✅ Group unlinked."})}catch(e){await sock.sendMessage(jid,{text:"❌ "+e.message})}
}};
