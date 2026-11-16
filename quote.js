module.exports={
  name:"quote",
  aliases:["q"],
  category:"Message",
  description:"Quote replied message",
  async execute(sock,msg){
    const jid=msg.key.remoteJid;
    const c=msg.message?.extendedTextMessage?.contextInfo;
    if(!c?.quotedMessage)return sock.sendMessage(jid,{text:"❌ আগে কোনো message-এ reply করো।"});
    const text=c.quotedMessage.conversation||c.quotedMessage.extendedTextMessage?.text||"📎 Media message";
    await sock.sendMessage(jid,{text:`💬 ${text}`},{quoted:msg});
  }
};
