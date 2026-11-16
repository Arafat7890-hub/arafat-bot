const cooldowns = new Map();
const COOLDOWN = 60000;

function canAlert(jid, sender, type) {
  const key = `${jid}:${sender}:${type}`;
  const now = Date.now();
  const last = cooldowns.get(key) || 0;

  if (now - last < COOLDOWN) return false;

  cooldowns.set(key, now);
  return true;
}

async function sendAlert(sock, jid, sender, type, count, meta) {
  if (!canAlert(jid, sender, type)) return;

  const admins = (meta?.participants || [])
    .filter(p => p.admin)
    .map(p => p.id)
    .filter(Boolean);

  const mentions = [sender, ...admins];

  const text =
    "╭━━━〔 🛡️ ᴀʀᴀғᴀᴛ sʜɪᴇʟᴅ 〕━━━╮\n" +
    "┃\n" +
    `┃ ⚠️ ᴛʏᴘᴇ : ${type}\n` +
    `┃ 👤 ᴜsᴇʀ : @${sender.split("@")[0]}\n` +
    `┃ 📊 ᴄᴏᴜɴᴛ : ${count}\n` +
    "┃\n" +
    "┃ ⚠️ Suspicious activity detected.\n" +
    "┃ 🔧 Admin action required if needed.\n" +
    "┃\n" +
    "╰━━━━━━━━━━━━━━━━━━━━━━╯";

  await sock.sendMessage(jid, {
    text,
    mentions
  });
}

module.exports = { sendAlert };
