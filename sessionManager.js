const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "sessions");
const FILE = path.join(ROOT, "manager.json");
const MAX_SLOTS = 50;

if (!fs.existsSync(ROOT)) {
  fs.mkdirSync(ROOT, { recursive: true });
}

function load() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return { maxSlots: MAX_SLOTS, sessions: {} };
  }
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function createSlot() {
  const data = load();

  for (let i = 1; i <= MAX_SLOTS; i++) {
    const id = String(i);

    if (!data.sessions[id]) {
      data.sessions[id] = {
        id,
        status: "empty",
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      save(data);
      return data.sessions[id];
    }
  }

  return null;
}

function getSlot(id) {
  const data = load();
  return data.sessions[String(id)] || null;
}

function setStatus(id, status) {
  const data = load();
  const key = String(id);

  if (!data.sessions[key]) return false;

  data.sessions[key].status = status;
  data.sessions[key].updatedAt = Date.now();

  save(data);
  return true;
}

function removeSlot(id) {
  const data = load();
  const key = String(id);

  if (!data.sessions[key]) return false;

  delete data.sessions[key];
  save(data);
  return true;
}

function listSlots() {
  const data = load();
  return Object.values(data.sessions);
}

function stats() {
  const slots = listSlots();

  return {
    max: MAX_SLOTS,
    used: slots.length,
    active: slots.filter(x => x.status === "connected").length,
    connecting: slots.filter(x => x.status === "connecting").length,
    empty: MAX_SLOTS - slots.length
  };
}

module.exports = {
  MAX_SLOTS,
  createSlot,
  getSlot,
  setStatus,
  removeSlot,
  listSlots,
  stats
};
