const joins = new Map();
const WINDOW = 30000;
const MAX_JOINS = 5;

function check(jid, count = 1) {
  const now = Date.now();
  let data = joins.get(jid);

  if (!data || now - data.start > WINDOW) {
    data = { start: now, count: 0 };
  }

  data.count += count;
  joins.set(jid, data);

  return {
    suspicious: data.count > MAX_JOINS,
    count: data.count
  };
}

module.exports = { check };
