module.exports={
 name:"aboutbot",
 aliases:["botabout"],
 category:"Utility",
 description:"Bot information",
 async execute(sock,msg,args){
  const jid=msg.key.remoteJid;
  const t=args.join(" ").trim();
  let out;
  if("aboutbot"==="wordcount")out="📝 Words: "+(t?t.split(/\s+/).length:0);
  else if("aboutbot"==="charcount")out="🔢 Characters: "+t.length;
  else if("aboutbot"==="reverse")out=t.split("").reverse().join("")||"Usage: .reverse text";
  else if("aboutbot"==="uppercase")out=t.toUpperCase()||"Usage: .uppercase text";
  else if("aboutbot"==="lowercase")out=t.toLowerCase()||"Usage: .lowercase text";
  else if("aboutbot"==="trim")out=t.replace(/\s+/g," ")||"Usage: .trim text";
  else if("aboutbot"==="echo")out=t||"Usage: .echo text";
  else if("aboutbot"==="flip")out="🪙 "+(Math.random()<.5?"Heads":"Tails");
  else if("aboutbot"==="roll")out="🎲 "+(Math.floor(Math.random()*6)+1);
  else if("aboutbot"==="choose"){const a=t.split("|").map(x=>x.trim()).filter(Boolean);out=a.length?"🎯 "+a[Math.floor(Math.random()*a.length)]:"Usage: .choose red | blue";}
  else if("aboutbot"==="randomnumber"){let a=Number(args[0])||1,b=Number(args[1])||100;out="🔢 "+(Math.floor(Math.random()*(Math.max(a,b)-Math.min(a,b)+1))+Math.min(a,b));}
  else if("aboutbot"==="timestamp")out="⏱️ "+Date.now();
  else if("aboutbot"==="whoami")out="👤 "+(msg.key.participant||jid);
  else if("aboutbot"==="aboutbot")out="🤖 𝗔𝗿𝗮𝗳𝗮𝘁 𝗕𝗯𝘇\n⚡ Active\n🧩 Baileys";
  else if("aboutbot"==="prefixinfo")out="⚙️ Prefix: .";
  else if("aboutbot"==="sorttext")out=t.split(/\s+/).filter(Boolean).sort().join(" ")||"Usage: .sorttext words";
  else if("aboutbot"==="unique")out=[...new Set(t.split(/\s+/).filter(Boolean))].join(" ")||"Usage: .unique text";
  else if("aboutbot"==="length")out="📏 "+t.length;
  else if("aboutbot"==="repeat"){const n=Math.min(Math.max(Number(args[0])||1,1),10);out=Array(n).fill(args.slice(1).join(" ")).join("\n")||"Usage: .repeat 3 hello";}
  else if("aboutbot"==="weekday")out="📅 "+new Date().toLocaleDateString("en-BD",{weekday:"long",timeZone:"Asia/Dhaka"});
  await sock.sendMessage(jid,{text:out});
 }
};
