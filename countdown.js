module.exports={name:"countdown",aliases:["cd"],category:"Utility",description:"Simple countdown",async execute(sock,msg,args){
const jid=msg.key.remoteJid,n=Math.min(Math.max(parseInt(args[0]||"5"),1),10);
for(let i=n;i>0;i--){await sock.sendMessage(jid,{text:`⏳ ${i}`});await new Promise(r=>setTimeout(r,1000))}
await sock.sendMessage(jid,{text:"🚀 GO!"});
}};
