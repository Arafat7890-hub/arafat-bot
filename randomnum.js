module.exports={name:"randomnum",aliases:["randnum"],category:"Utility",description:"Random number",async execute(sock,msg,args){
const jid=msg.key.remoteJid,a=parseInt(args[0]||"1"),b=parseInt(args[1]||"100");
const min=Math.min(a,b),max=Math.max(a,b),n=Math.floor(Math.random()*(max-min+1))+min;
await sock.sendMessage(jid,{text:`🎲 ${n}`});
}};
