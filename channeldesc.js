module.exports={name:"channeldesc",aliases:["changedesc"],category:"Channel",description:"Change channel description",async execute(sock,msg,args){
const jid=msg.key.remoteJid,c=args.shift(),d=args.join(" ").trim();
if(!c||!d)return sock.sendMessage(jid,{text:"❌ Use: .channeldesc CHANNEL_JID Description"});
try{await sock.newsletterUpdateDescription(c,d);await sock.sendMessage(jid,{text:"✅ Channel description updated."})}catch(e){await sock.sendMessage(jid,{text:"❌ "+e.message})}
}};
