const links = new Map();

const WINDOW = 15000;
const MAX_LINKS = 3;

function check(jid, sender, text = "") {
  const matches = String(text).match(/https?:\/\/\S+|www\.\S+/gi) || [];

  if (!matches.length) {
    return { suspicious: false, count: 0 };
  }

  const key = `${jid}:${sender}`;
  const now = Date.now();

  let data = links.get(key);

  if (!data || now - data.start > WINDOW) {
    data = { start: now, count: 0 };
  }

  data.count += matches.length;
  links.set(key, data);

  return {
    suspicious: data.count > MAX_LINKS,
    count: data.count
  };
}

module.exports = { check };
