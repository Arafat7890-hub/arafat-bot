module.exports={name:"newsletters",aliases:["channels"],category:"Channel",description:"List followed channels",async execute(sock,msg){
const jid=msg.key.remoteJid;try{const r=await sock.newsletterSubscribed();await sock.sendMessage(jid,{text:`📣 SUBSCRIBED CHANNELS\n\n${JSON.stringify(r,null,2).slice(0,6000)}`})}catch(e){await sock.sendMessage(jid,{text:"❌ "+e.message})}
}};
