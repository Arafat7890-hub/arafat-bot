module.exports={name:"channelmessages",aliases:["channelposts"],category:"Channel",description:"Fetch channel posts",async execute(sock,msg,args){
const jid=msg.key.remoteJid,c=args[0];if(!c)return sock.sendMessage(jid,{text:"❌ Channel JID দাও।"});
try{const r=await sock.newsletterFetchMessages("jid",c,20,0,0);await sock.sendMessage(jid,{text:`📣 POSTS\n\n${JSON.stringify(r,null,2).slice(0,6000)}`})}catch(e){await sock.sendMessage(jid,{text:"❌ "+e.message})}
}};
