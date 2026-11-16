module.exports={name:"uptime2",aliases:["up2"],category:"System",description:"Bot uptime",async execute(sock,msg){
const jid=msg.key.remoteJid,s=Math.floor(process.uptime()),d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60),sec=s%60;
await sock.sendMessage(jid,{text:`⏱️ Uptime\n\n${d}d ${h}h ${m}m ${sec}s`});
}};
