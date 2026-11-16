const media = new Map();
const WINDOW = 15000;
const MAX_MEDIA = 5;

function check(jid, sender, message) {
  const type = message?.imageMessage ? "image" :
               message?.videoMessage ? "video" :
               message?.audioMessage ? "audio" :
               message?.documentMessage ? "document" :
               message?.stickerMessage ? "sticker" : null;

  if (!type) return { suspicious: false, count: 0, type: null };

  const key = `${jid}:${sender}`;
  const now = Date.now();
  let data = media.get(key);

  if (!data || now - data.start > WINDOW) {
    data = { start: now, count: 0 };
  }

  data.count++;
  media.set(key, data);

  return {
    suspicious: data.count > MAX_MEDIA,
    count: data.count,
    type
  };
}

module.exports = { check };
