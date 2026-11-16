module.exports={
  name:"contact",
  aliases:["vcard"],
  category:"Utility",
  description:"Send a contact card",
  async execute(sock,msg,args){
    const jid=msg.key.remoteJid;
    const number=(args[0]||"").replace(/\D/g,"");
    const name=args.slice(1).join(" ")||"WhatsApp Contact";
    if(!number)return sock.sendMessage(jid,{text:"❌ Use: `.contact 8801XXXXXXXXX Name`"});
    const vcard=`BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;type=CELL;type=VOICE;waid=${number}:+${number}
END:VCARD`;
    try{
      await sock.sendMessage(jid,{
        contacts:{displayName:name,contacts:[{vcard}]}
      });
    }catch(e){
      await sock.sendMessage(jid,{text:"❌ Contact send failed: "+e.message});
    }
  }
};
