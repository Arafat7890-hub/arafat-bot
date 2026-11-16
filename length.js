module.exports={name:"length",aliases:["strlen"],category:"Text",description:"Text length",async execute(sock,msg,args){
const jid=msg.key.remoteJid,t=args.join(" "); await sock.sendMessage(jid,{text:`📏 Characters: ${t.length}\n📝 Words: ${(t.trim().match(/\S+/g)||[]).length}`});
}};
