module.exports={
  name:"quoteinfo2",
  aliases:["replyinfo"],
  category:"Message",
  description:"Show replied message information",
  async execute(sock,msg){
    const jid=msg.key.remoteJid;
    const c=msg.message?.extendedTextMessage?.contextInfo;
    if(!c?.stanzaId)return sock.sendMessage(jid,{text:"❌ আগে message-এ reply করো।"});
    await sock.sendMessage(jid,{text:
`📌 REPLY INFO

🆔 ID: ${c.stanzaId}
👤 Sender: ${c.participant||"Unknown"}
💬 Quoted: ${!!c.quotedMessage}`
    });
  }
};
