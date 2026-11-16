module.exports={
  name:"mention",
  aliases:["tagme"],
  category:"Group",
  description:"Mention yourself",
  async execute(sock,msg){
    const jid=msg.key.remoteJid;
    const user=msg.key.participant||sock.user?.id;
    if(!user)return;
    await sock.sendMessage(jid,{
      text:`👤 @${user.split("@")[0].split(":")[0]}`,
      mentions:[user]
    });
  }
};
