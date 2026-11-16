module.exports={name:"reversewords",aliases:["revwords"],category:"Text",description:"Reverse word order",async execute(sock,msg,args){
const jid=msg.key.remoteJid,t=args.join(" ");
if(!t)return sock.sendMessage(jid,{text:"❌ Text দাও।"});
await sock.sendMessage(jid,{text:t.split(/\s+/).reverse().join(" ")});
}};
