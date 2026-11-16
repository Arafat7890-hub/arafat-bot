const repeats = new Map();
const WINDOW = 12000;
const MAX_REPEAT = 4;

function check(jid, sender, text = "") {
  text = String(text).trim();
  if (!text) return { suspicious: false, count: 0 };

  const key = `${jid}:${sender}`;
  const now = Date.now();
  let data = repeats.get(key);

  if (!data || now - data.start > WINDOW || data.text !== text) {
    data = { start: now, text, count: 0 };
  }

  data.count++;
  repeats.set(key, data);

  return {
    suspicious: data.count > MAX_REPEAT,
    count: data.count
  };
}

module.exports = { check };
