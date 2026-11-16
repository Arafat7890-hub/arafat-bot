module.exports={
 name:"prefixinfo",
 aliases:["prefix"],
 category:"Utility",
 description:"Show prefix",
 async execute(sock,msg,args){
  const jid=msg.key.remoteJid;
  const t=args.join(" ").trim();
  let out;
  if("prefixinfo"==="wordcount")out="📝 Words: "+(t?t.split(/\s+/).length:0);
  else if("prefixinfo"==="charcount")out="🔢 Characters: "+t.length;
  else if("prefixinfo"==="reverse")out=t.split("").reverse().join("")||"Usage: .reverse text";
  else if("prefixinfo"==="uppercase")out=t.toUpperCase()||"Usage: .uppercase text";
  else if("prefixinfo"==="lowercase")out=t.toLowerCase()||"Usage: .lowercase text";
  else if("prefixinfo"==="trim")out=t.replace(/\s+/g," ")||"Usage: .trim text";
  else if("prefixinfo"==="echo")out=t||"Usage: .echo text";
  else if("prefixinfo"==="flip")out="🪙 "+(Math.random()<.5?"Heads":"Tails");
  else if("prefixinfo"==="roll")out="🎲 "+(Math.floor(Math.random()*6)+1);
  else if("prefixinfo"==="choose"){const a=t.split("|").map(x=>x.trim()).filter(Boolean);out=a.length?"🎯 "+a[Math.floor(Math.random()*a.length)]:"Usage: .choose red | blue";}
  else if("prefixinfo"==="randomnumber"){let a=Number(args[0])||1,b=Number(args[1])||100;out="🔢 "+(Math.floor(Math.random()*(Math.max(a,b)-Math.min(a,b)+1))+Math.min(a,b));}
  else if("prefixinfo"==="timestamp")out="⏱️ "+Date.now();
  else if("prefixinfo"==="whoami")out="👤 "+(msg.key.participant||jid);
  else if("prefixinfo"==="aboutbot")out="🤖 𝗔𝗿𝗮𝗳𝗮𝘁 𝗕𝗯𝘇\n⚡ Active\n🧩 Baileys";
  else if("prefixinfo"==="prefixinfo")out="⚙️ Prefix: .";
  else if("prefixinfo"==="sorttext")out=t.split(/\s+/).filter(Boolean).sort().join(" ")||"Usage: .sorttext words";
  else if("prefixinfo"==="unique")out=[...new Set(t.split(/\s+/).filter(Boolean))].join(" ")||"Usage: .unique text";
  else if("prefixinfo"==="length")out="📏 "+t.length;
  else if("prefixinfo"==="repeat"){const n=Math.min(Math.max(Number(args[0])||1,1),10);out=Array(n).fill(args.slice(1).join(" ")).join("\n")||"Usage: .repeat 3 hello";}
  else if("prefixinfo"==="weekday")out="📅 "+new Date().toLocaleDateString("en-BD",{weekday:"long",timeZone:"Asia/Dhaka"});
  await sock.sendMessage(jid,{text:out});
 }
};
