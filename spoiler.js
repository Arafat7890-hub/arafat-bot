module.exports={name:"spoiler",aliases:["hide"],category:"Message",description:"Send spoiler text",async execute(sock,msg,args){
const jid=msg.key.remoteJid,text=args.join(" ").trim();
if(!text)return sock.sendMessage(jid,{text:"❌ Text দাও।"});
try{await sock.sendMessage(jid,{text:"||"+text+"||"})}catch(e){await sock.sendMessage(jid,{text:"❌ Failed: "+e.message})}
}};
