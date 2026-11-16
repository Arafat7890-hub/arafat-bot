module.exports={
 name:"roll",
 aliases:[],
 category:"Utility",
 description:"Roll dice",
 async execute(sock,msg,args){
  const jid=msg.key.remoteJid;
  const t=args.join(" ").trim();
  let out;
  if("roll"==="wordcount")out="📝 Words: "+(t?t.split(/\s+/).length:0);
  else if("roll"==="charcount")out="🔢 Characters: "+t.length;
  else if("roll"==="reverse")out=t.split("").reverse().join("")||"Usage: .reverse text";
  else if("roll"==="uppercase")out=t.toUpperCase()||"Usage: .uppercase text";
  else if("roll"==="lowercase")out=t.toLowerCase()||"Usage: .lowercase text";
  else if("roll"==="trim")out=t.replace(/\s+/g," ")||"Usage: .trim text";
  else if("roll"==="echo")out=t||"Usage: .echo text";
  else if("roll"==="flip")out="🪙 "+(Math.random()<.5?"Heads":"Tails");
  else if("roll"==="roll")out="🎲 "+(Math.floor(Math.random()*6)+1);
  else if("roll"==="choose"){const a=t.split("|").map(x=>x.trim()).filter(Boolean);out=a.length?"🎯 "+a[Math.floor(Math.random()*a.length)]:"Usage: .choose red | blue";}
  else if("roll"==="randomnumber"){let a=Number(args[0])||1,b=Number(args[1])||100;out="🔢 "+(Math.floor(Math.random()*(Math.max(a,b)-Math.min(a,b)+1))+Math.min(a,b));}
  else if("roll"==="timestamp")out="⏱️ "+Date.now();
  else if("roll"==="whoami")out="👤 "+(msg.key.participant||jid);
  else if("roll"==="aboutbot")out="🤖 𝗔𝗿𝗮𝗳𝗮𝘁 𝗕𝗯𝘇\n⚡ Active\n🧩 Baileys";
  else if("roll"==="prefixinfo")out="⚙️ Prefix: .";
  else if("roll"==="sorttext")out=t.split(/\s+/).filter(Boolean).sort().join(" ")||"Usage: .sorttext words";
  else if("roll"==="unique")out=[...new Set(t.split(/\s+/).filter(Boolean))].join(" ")||"Usage: .unique text";
  else if("roll"==="length")out="📏 "+t.length;
  else if("roll"==="repeat"){const n=Math.min(Math.max(Number(args[0])||1,1),10);out=Array(n).fill(args.slice(1).join(" ")).join("\n")||"Usage: .repeat 3 hello";}
  else if("roll"==="weekday")out="📅 "+new Date().toLocaleDateString("en-BD",{weekday:"long",timeZone:"Asia/Dhaka"});
  await sock.sendMessage(jid,{text:out});
 }
};
