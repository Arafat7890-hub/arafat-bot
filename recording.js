module.exports={name:"recording",aliases:["record"],category:"Utility",description:"Show recording status",async execute(sock,msg,args){
const jid=msg.key.remoteJid; const ms=Math.min(Math.max(parseInt(args[0]||"3000"),500),10000);
try{await sock.sendPresenceUpdate("recording",jid);setTimeout(()=>sock.sendPresenceUpdate("paused",jid).catch(()=>{}),ms)}catch(e){await sock.sendMessage(jid,{text:"❌ Failed: "+e.message})}
}};
