module.exports={name:"repeattext",aliases:["repeatx"],category:"Utility",description:"Repeat text",async execute(sock,msg,args){
const jid=msg.key.remoteJid,n=Math.min(Math.max(parseInt(args[0]||"1"),1),20),text=args.slice(1).join(" ");
if(!text)return sock.sendMessage(jid,{text:"❌ Use: `.repeattext 3 hello`"});
await sock.sendMessage(jid,{text:Array(n).fill(text).join("\n")});
}};
