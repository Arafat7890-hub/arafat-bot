module.exports={name:"channeladmins",aliases:["channeladmincount"],category:"Channel",description:"Channel admin count",async execute(sock,msg,args){
const jid=msg.key.remoteJid,c=args[0]||jid;try{const n=await sock.newsletterAdminCount(c);await sock.sendMessage(jid,{text:`👑 Channel admins: ${n}`})}catch(e){await sock.sendMessage(jid,{text:"❌ "+e.message})}
}};
