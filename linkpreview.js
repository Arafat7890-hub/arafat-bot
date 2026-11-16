module.exports={name:"linkpreview",aliases:["previewprivacy"],category:"Privacy",description:"Toggle link preview privacy",async execute(sock,msg,args){
const jid=msg.key.remoteJid,m=(args[0]||"").toLowerCase();
if(!["on","off"].includes(m))return sock.sendMessage(jid,{text:"❌ Use: .linkpreview on|off"});
try{await sock.updateDisableLinkPreviewsPrivacy(m==="on");await sock.sendMessage(jid,{text:`✅ Link preview privacy: ${m}`})}catch(e){await sock.sendMessage(jid,{text:"❌ "+e.message})}
}};
