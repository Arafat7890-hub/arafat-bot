module.exports={
  name:"type",
  aliases:["msgtype"],
  category:"Utility",
  description:"Show message type",
  async execute(sock,msg){
    const jid=msg.key.remoteJid;
    const m=msg.message||{};
    const type=Object.keys(m).find(k=>k!=="messageContextInfo")||"unknown";
    await sock.sendMessage(jid,{text:`📦 Message Type\n\n${type}`});
  }
};
