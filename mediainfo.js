module.exports={
  name:"mediainfo",
  aliases:["minfo"],
  category:"Media",
  description:"Show replied media information",
  async execute(sock,msg){
    const jid=msg.key.remoteJid;
    const q=msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if(!q)return sock.sendMessage(jid,{text:"❌ আগে media-তে reply করো।"});
    const key=Object.keys(q).find(k=>/Message$/.test(k));
    const m=key?q[key]:null;
    if(!m)return sock.sendMessage(jid,{text:"❌ Media পাওয়া যায়নি।"});
    await sock.sendMessage(jid,{text:
`📦 MEDIA INFO

Type: ${key}
MIME: ${m.mimetype||"Unknown"}
Size: ${m.fileLength||"Unknown"}
Width: ${m.width||"-"}
Height: ${m.height||"-"}`
    });
  }
};
