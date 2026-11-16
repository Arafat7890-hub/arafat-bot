module.exports={name:"typing",aliases:["type"],category:"Utility",description:"Show typing status",async execute(sock,msg,args){
const jid=msg.key.remoteJid; const ms=Math.min(Math.max(parseInt(args[0]||"3000"),500),10000);
try{await sock.sendPresenceUpdate("composing",jid);setTimeout(()=>sock.sendPresenceUpdate("paused",jid).catch(()=>{}),ms)}catch(e){await sock.sendMessage(jid,{text:"❌ Failed: "+e.message})}
}};
