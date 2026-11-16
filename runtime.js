function format(ms) {
  const sec = Math.floor(ms / 1000);
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  return `${d}d ${h}h ${m}m ${s}s`;
}

function formatMB(bytes) {
  return (bytes / 1024 / 1024).toFixed(1);
}

module.exports = {
  name: "runtime",
  aliases: ["uptime"],
  category: "Info",
  description: "Show bot runtime information",

  async execute(sock, msg) {
    const memory = process.memoryUsage();

    const text = `╭━━━〔 ⏱️ 𝗥𝗨𝗡𝗧𝗜𝗠𝗘 〕━━━╮
┃
┃ 🟢 Status  : Online
┃ ⏱️ Uptime  : ${format(process.uptime() * 1000)}
┃ 🟢 RAM     : ${formatMB(memory.rss)} MB
┃ 📦 Heap    : ${formatMB(memory.heapUsed)} / ${formatMB(memory.heapTotal)} MB
┃ 🟢 Node    : ${process.version}
┃ 📱 Platform: ${process.platform}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`;

    await sock.sendMessage(msg.key.remoteJid, { text });
  }
};
