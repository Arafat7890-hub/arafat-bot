module.exports={name:"coinflip",aliases:["flipcoin"],category:"Fun",description:"Flip coin",async execute(sock,msg){
await sock.sendMessage(msg.key.remoteJid,{text:Math.random()<.5?"🪙 Heads":"🪙 Tails"});
}};
