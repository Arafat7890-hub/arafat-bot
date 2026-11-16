const sessionManager = require("./sessionManager");

const VALID = [
  "empty",
  "connecting",
  "connected",
  "disconnected",
  "logged_out",
  "error"
];

function set(slotId, status) {
  if (!VALID.includes(status)) {
    throw new Error(`Invalid session status: ${status}`);
  }

  const slot = sessionManager.getSlot(slotId);

  if (!slot) {
    throw new Error(`Slot ${slotId} not found`);
  }

  sessionManager.setStatus(slotId, status);

  return sessionManager.getSlot(slotId);
}

function get(slotId) {
  return sessionManager.getSlot(slotId);
}

function list() {
  return sessionManager.listSlots();
}

module.exports = {
  set,
  get,
  list,
  VALID
};
