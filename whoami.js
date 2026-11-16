module.exports={
 name:"whoami",
 aliases:[],
 category:"Utility",
 description:"Sender JID",
 async execute(sock,msg,args){
  const jid=msg.key.remoteJid;
  const t=args.join(" ").trim();
  let out;
  if("whoami"==="wordcount")out="📝 Words: "+(t?t.split(/\s+/).length:0);
  else if("whoami"==="charcount")out="🔢 Characters: "+t.length;
  else if("whoami"==="reverse")out=t.split("").reverse().join("")||"Usage: .reverse text";
  else if("whoami"==="uppercase")out=t.toUpperCase()||"Usage: .uppercase text";
  else if("whoami"==="lowercase")out=t.toLowerCase()||"Usage: .lowercase text";
  else if("whoami"==="trim")out=t.replace(/\s+/g," ")||"Usage: .trim text";
  else if("whoami"==="echo")out=t||"Usage: .echo text";
  else if("whoami"==="flip")out="🪙 "+(Math.random()<.5?"Heads":"Tails");
  else if("whoami"==="roll")out="🎲 "+(Math.floor(Math.random()*6)+1);
  else if("whoami"==="choose"){const a=t.split("|").map(x=>x.trim()).filter(Boolean);out=a.length?"🎯 "+a[Math.floor(Math.random()*a.length)]:"Usage: .choose red | blue";}
  else if("whoami"==="randomnumber"){let a=Number(args[0])||1,b=Number(args[1])||100;out="🔢 "+(Math.floor(Math.random()*(Math.max(a,b)-Math.min(a,b)+1))+Math.min(a,b));}
  else if("whoami"==="timestamp")out="⏱️ "+Date.now();
  else if("whoami"==="whoami")out="👤 "+(msg.key.participant||jid);
  else if("whoami"==="aboutbot")out="🤖 𝗔𝗿𝗮𝗳𝗮𝘁 𝗕𝗯𝘇\n⚡ Active\n🧩 Baileys";
  else if("whoami"==="prefixinfo")out="⚙️ Prefix: .";
  else if("whoami"==="sorttext")out=t.split(/\s+/).filter(Boolean).sort().join(" ")||"Usage: .sorttext words";
  else if("whoami"==="unique")out=[...new Set(t.split(/\s+/).filter(Boolean))].join(" ")||"Usage: .unique text";
  else if("whoami"==="length")out="📏 "+t.length;
  else if("whoami"==="repeat"){const n=Math.min(Math.max(Number(args[0])||1,1),10);out=Array(n).fill(args.slice(1).join(" ")).join("\n")||"Usage: .repeat 3 hello";}
  else if("whoami"==="weekday")out="📅 "+new Date().toLocaleDateString("en-BD",{weekday:"long",timeZone:"Asia/Dhaka"});
  await sock.sendMessage(jid,{text:out});
 }
};
