module.exports={name:"mediatype",aliases:["typeofmedia"],category:"Utility",description:"Detect media type",async execute(sock,msg){
const jid=msg.key.remoteJid,m=msg.message||{};
const types=["imageMessage","videoMessage","audioMessage","documentMessage","stickerMessage","contactMessage","locationMessage","pollCreationMessage"];
const type=types.find(x=>m[x]);
await sock.sendMessage(jid,{text:`📦 MEDIA TYPE\n\n${type||"Text / Unknown"}`});
}};
