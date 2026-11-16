const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "data");
const file = path.join(dir, "group-status.json");

if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

function load() {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return {};
  }
}

function save(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function add(groupJid, key) {
  const data = load();

  if (!data[groupJid]) data[groupJid] = [];

  data[groupJid].push({
    key,
    createdAt: Date.now()
  });

  // Keep latest 50 only
  data[groupJid] = data[groupJid].slice(-50);

  save(data);
}

function get(groupJid) {
  return load()[groupJid] || [];
}

function remove(groupJid, id) {
  const data = load();

  if (!data[groupJid]) return;

  data[groupJid] = data[groupJid].filter(x => x.key?.id !== id);

  save(data);
}

function clear(groupJid) {
  const data = load();
  delete data[groupJid];
  save(data);
}

module.exports = {
  add,
  get,
  remove,
  clear
};
