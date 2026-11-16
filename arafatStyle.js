function box(title, lines = []) {
  const body = lines.map(x => `├✦ ${x}`).join("\n");

  return `╭┈───〔 —͟͞͞𝗔ʀᴀꜰᴀᴛㅤBbz ᥫ᭡፝֟ 〕┈───⊷
├✦ ${title}
${body}
╰───────────────────⊷`;
}

module.exports = { box };
