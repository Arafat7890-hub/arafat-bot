const fs = require("fs");
const path = require("path");

function smallCaps(text) {
  const map = {
    a:"ᴀ", b:"ʙ", c:"ᴄ", d:"ᴅ", e:"ᴇ", f:"ꜰ", g:"ɢ",
    h:"ʜ", i:"ɪ", j:"ᴊ", k:"ᴋ", l:"ʟ", m:"ᴍ", n:"ɴ",
    o:"ᴏ", p:"ᴘ", q:"ǫ", r:"ʀ", s:"ꜱ", t:"ᴛ", u:"ᴜ",
    v:"ᴠ", w:"ᴡ", x:"x", y:"ʏ", z:"ᴢ"
  };

  return String(text)
    .toLowerCase()
    .replace(/[a-z]/g, c => map[c] || c);
}

function getCommands() {
  const dir = __dirname;
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith(".js"))
    .filter(f => !/(backup|before|broken)/i.test(f))
    .filter(f => f !== "menu.js");

  const unique = new Map();

  for (const file of files) {
    try {
      const source = fs.readFileSync(path.join(dir, file), "utf8");

      const name =
        source.match(/name\s*:\s*["'`]([^"'`]+)["'`]/)?.[1] ||
        file.replace(".js", "");

      const category =
        source.match(/category\s*:\s*["'`]([^"'`]+)["'`]/)?.[1] ||
        "Other";

      const cleanName = String(name).toLowerCase().trim();

      if (!cleanName) continue;
      if (unique.has(cleanName)) continue;

      unique.set(cleanName, {
        name: cleanName,
        category: String(category).trim() || "Other"
      });
    } catch {}
  }

  const preferred = [
    "ai","ask","explain","summarize","translate",
    "grammar","rewrite","code","debug","math",
    "alive","menu","ping","runtime","uptime",
    "tagall","admins","groupinfo","gcstatus",
    "antilink","antisticker","antiflood","antiraid",
    "antibadword","antibot","allprotect"
  ];

  const priority = [];
  const normal = [];

  for (const cmd of unique.values()) {
    if (preferred.includes(cmd.name)) priority.push(cmd);
    else normal.push(cmd);
  }

  priority.sort(
    (a, b) => preferred.indexOf(a.name) - preferred.indexOf(b.name)
  );

  normal.sort(
    (a, b) =>
      a.category.localeCompare(b.category) ||
      a.name.localeCompare(b.name)
  );

  return [...priority, ...normal];
}

module.exports = {
  name: "menu",
  aliases: ["help", "allmenu"],
  category: "Main",
  description: "Show Arafat Bbz premium menu",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    const commands = getCommands();

    const groups = {};

    for (const cmd of commands) {
      if (!groups[cmd.category]) {
        groups[cmd.category] = [];
      }

      groups[cmd.category].push(cmd.name);
    }

    let menu =
`╭┈───〔 —͟͞͞𝗔ʀᴀꜰᴀᴛㅤBbz ᥫ᭡፝֟ 〕┈───⊷
├✦ Owner: Arafat
├✦ Commands: ${commands.length}
├✦ Runtime: Active
├✦ Prefix: .
├✦ Mode: ${global.arafatMode || "public"}
├✦ Version: 1.0.0
╰───────────────────⊷

`;


    for (const [category, names] of Object.entries(groups)) {
      menu +=
`╭┈───〔 𝗠𝗢𝗗𝗨𝗟𝗘: ${category.toUpperCase()} 〕┈───⊷
`;

      for (const name of names) {
        menu += `├✦ .${smallCaps(name)}\n`;
      }

      menu += `╰───────────────────⊷\n\n`;
    }

    menu +=
`╭┈───〔 𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗥 〕┈───⊷
├✦ Powered By: —͟͞͞𝗔ʀᴀꜰᴀᴛㅤBbz ᥫ᭡፝֟
╰───────────────────⊷`;

    await sock.sendMessage(jid, { text: menu });
  }
};
