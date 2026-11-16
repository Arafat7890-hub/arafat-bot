module.exports={name:"communitycreate",aliases:["ccreate"],category:"Community",description:"Create community",async execute(sock,msg,args){
const jid=msg.key.remoteJid,n=args.join(" ").trim();
if(!n)return sock.sendMessage(jid,{text:"❌ Use: .communitycreate Community Name"});
try{const r=await sock.communityCreate(n,"");await sock.sendMessage(jid,{text:`✅ Community created\n\n${r?.id||""}`})}catch(e){await sock.sendMessage(jid,{text:"❌ "+e.message})}
}};
