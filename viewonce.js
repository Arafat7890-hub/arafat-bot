module.exports={name:"viewonce",aliases:["once"],category:"Media",description:"Send replied media as view once",async execute(sock,msg){
const jid=msg.key.remoteJid,c=msg.message?.extendedTextMessage?.contextInfo,q=c?.quotedMessage;
if(!q)return sock.sendMessage(jid,{text:"❌ আগে image/video-তে reply করো।"});
try{
if(q.imageMessage) await sock.sendMessage(jid,{image:{url:q.imageMessage.url},caption:q.imageMessage.caption||"",viewOnce:true});
else if(q.videoMessage) await sock.sendMessage(jid,{video:{url:q.videoMessage.url},caption:q.videoMessage.caption||"",viewOnce:true});
else await sock.sendMessage(jid,{text:"❌ শুধু image/video support করে।"});
}catch(e){await sock.sendMessage(jid,{text:"❌ Failed: "+e.message})}
}};
