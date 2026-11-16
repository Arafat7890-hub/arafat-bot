module.exports={
 name:"sorttext",
 aliases:["sort"],
 category:"Utility",
 description:"Sort words",
 async execute(sock,msg,args){
  const jid=msg.key.remoteJid;
  const t=args.join(" ").trim();
  let out;
  if("sorttext"==="wordcount")out="📝 Words: "+(t?t.split(/\s+/).length:0);
  else if("sorttext"==="charcount")out="🔢 Characters: "+t.length;
  else if("sorttext"==="reverse")out=t.split("").reverse().join("")||"Usage: .reverse text";
  else if("sorttext"==="uppercase")out=t.toUpperCase()||"Usage: .uppercase text";
  else if("sorttext"==="lowercase")out=t.toLowerCase()||"Usage: .lowercase text";
  else if("sorttext"==="trim")out=t.replace(/\s+/g," ")||"Usage: .trim text";
  else if("sorttext"==="echo")out=t||"Usage: .echo text";
  else if("sorttext"==="flip")out="🪙 "+(Math.random()<.5?"Heads":"Tails");
  else if("sorttext"==="roll")out="🎲 "+(Math.floor(Math.random()*6)+1);
  else if("sorttext"==="choose"){const a=t.split("|").map(x=>x.trim()).filter(Boolean);out=a.length?"🎯 "+a[Math.floor(Math.random()*a.length)]:"Usage: .choose red | blue";}
  else if("sorttext"==="randomnumber"){let a=Number(args[0])||1,b=Number(args[1])||100;out="🔢 "+(Math.floor(Math.random()*(Math.max(a,b)-Math.min(a,b)+1))+Math.min(a,b));}
  else if("sorttext"==="timestamp")out="⏱️ "+Date.now();
  else if("sorttext"==="whoami")out="👤 "+(msg.key.participant||jid);
  else if("sorttext"==="aboutbot")out="🤖 𝗔𝗿𝗮𝗳𝗮𝘁 𝗕𝗯𝘇\n⚡ Active\n🧩 Baileys";
  else if("sorttext"==="prefixinfo")out="⚙️ Prefix: .";
  else if("sorttext"==="sorttext")out=t.split(/\s+/).filter(Boolean).sort().join(" ")||"Usage: .sorttext words";
  else if("sorttext"==="unique")out=[...new Set(t.split(/\s+/).filter(Boolean))].join(" ")||"Usage: .unique text";
  else if("sorttext"==="length")out="📏 "+t.length;
  else if("sorttext"==="repeat"){const n=Math.min(Math.max(Number(args[0])||1,1),10);out=Array(n).fill(args.slice(1).join(" ")).join("\n")||"Usage: .repeat 3 hello";}
  else if("sorttext"==="weekday")out="📅 "+new Date().toLocaleDateString("en-BD",{weekday:"long",timeZone:"Asia/Dhaka"});
  await sock.sendMessage(jid,{text:out});
 }
};
