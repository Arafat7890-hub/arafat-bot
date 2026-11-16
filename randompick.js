module.exports={name:"randompick",aliases:["pickone"],category:"Utility",description:"Pick random option",async execute(sock,msg,args){
const jid=msg.key.remoteJid;if(!args.length)return sock.sendMessage(jid,{text:"❌ Options দাও।"});
await sock.sendMessage(jid,{text:`🎯 ${args[Math.floor(Math.random()*args.length)]}`});
}};
