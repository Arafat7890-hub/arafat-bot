module.exports={name:"channelname",aliases:["changecname"],category:"Channel",description:"Change channel name",async execute(sock,msg,args){
const jid=msg.key.remoteJid,c=args.shift(),name=args.join(" ").trim();
if(!c||!name)return sock.sendMessage(jid,{text:"❌ Use: .channelname CHANNEL_JID New Name"});
try{await sock.newsletterUpdateName(c,name);await sock.sendMessage(jid,{text:"✅ Channel name updated."})}catch(e){await sock.sendMessage(jid,{text:"❌ "+e.message})}
}};
