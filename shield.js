const users = new Map();

const WINDOW = 10000;
const MAX_MESSAGES = 8;

function check(jid, sender) {
  const key = `${jid}:${sender}`;
  const now = Date.now();

  let data = users.get(key);

  if (!data || now - data.start > WINDOW) {
    data = {
      start: now,
      count: 0
    };
  }

  data.count++;
  users.set(key, data);

  if (data.count > MAX_MESSAGES) {
    return {
      suspicious: true,
      reason: "MESSAGE_BURST",
      count: data.count
    };
  }

  return {
    suspicious: false,
    reason: null,
    count: data.count
  };
}

function clear(jid, sender) {
  users.delete(`${jid}:${sender}`);
}

module.exports = {
  check,
  clear
};
