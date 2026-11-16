module.exports={
 name:"randomnumber",
 aliases:["rand"],
 category:"Utility",
 description:"Random number",
 async execute(sock,msg,args){
  const jid=msg.key.remoteJid;
  const t=args.join(" ").trim();
  let out;
  if("randomnumber"==="wordcount")out="📝 Words: "+(t?t.split(/\s+/).length:0);
  else if("randomnumber"==="charcount")out="🔢 Characters: "+t.length;
  else if("randomnumber"==="reverse")out=t.split("").reverse().join("")||"Usage: .reverse text";
  else if("randomnumber"==="uppercase")out=t.toUpperCase()||"Usage: .uppercase text";
  else if("randomnumber"==="lowercase")out=t.toLowerCase()||"Usage: .lowercase text";
  else if("randomnumber"==="trim")out=t.replace(/\s+/g," ")||"Usage: .trim text";
  else if("randomnumber"==="echo")out=t||"Usage: .echo text";
  else if("randomnumber"==="flip")out="🪙 "+(Math.random()<.5?"Heads":"Tails");
  else if("randomnumber"==="roll")out="🎲 "+(Math.floor(Math.random()*6)+1);
  else if("randomnumber"==="choose"){const a=t.split("|").map(x=>x.trim()).filter(Boolean);out=a.length?"🎯 "+a[Math.floor(Math.random()*a.length)]:"Usage: .choose red | blue";}
  else if("randomnumber"==="randomnumber"){let a=Number(args[0])||1,b=Number(args[1])||100;out="🔢 "+(Math.floor(Math.random()*(Math.max(a,b)-Math.min(a,b)+1))+Math.min(a,b));}
  else if("randomnumber"==="timestamp")out="⏱️ "+Date.now();
  else if("randomnumber"==="whoami")out="👤 "+(msg.key.participant||jid);
  else if("randomnumber"==="aboutbot")out="🤖 𝗔𝗿𝗮𝗳𝗮𝘁 𝗕𝗯𝘇\n⚡ Active\n🧩 Baileys";
  else if("randomnumber"==="prefixinfo")out="⚙️ Prefix: .";
  else if("randomnumber"==="sorttext")out=t.split(/\s+/).filter(Boolean).sort().join(" ")||"Usage: .sorttext words";
  else if("randomnumber"==="unique")out=[...new Set(t.split(/\s+/).filter(Boolean))].join(" ")||"Usage: .unique text";
  else if("randomnumber"==="length")out="📏 "+t.length;
  else if("randomnumber"==="repeat"){const n=Math.min(Math.max(Number(args[0])||1,1),10);out=Array(n).fill(args.slice(1).join(" ")).join("\n")||"Usage: .repeat 3 hello";}
  else if("randomnumber"==="weekday")out="📅 "+new Date().toLocaleDateString("en-BD",{weekday:"long",timeZone:"Asia/Dhaka"});
  await sock.sendMessage(jid,{text:out});
 }
};
