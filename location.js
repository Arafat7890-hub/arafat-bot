module.exports={name:"location",aliases:["loc"],category:"Utility",description:"Send location",async execute(sock,msg,args){
const jid=msg.key.remoteJid; const lat=parseFloat(args[0]), lon=parseFloat(args[1]);
if(!Number.isFinite(lat)||!Number.isFinite(lon)) return sock.sendMessage(jid,{text:"❌ Use: `.location latitude longitude`"});
try{await sock.sendMessage(jid,{location:{degreesLatitude:lat,degreesLongitude:lon}})}catch(e){await sock.sendMessage(jid,{text:"❌ Failed: "+e.message})}
}};
