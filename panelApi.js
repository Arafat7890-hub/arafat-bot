const sessionManager = require("./sessionManager");

function getStatus() {
  return {
    service: "Arafat Bbz Multi-Session",
    status: "online",
    ...sessionManager.stats(),
    slots: sessionManager.listSlots()
  };
}

function createSlot() {
  return sessionManager.createSlot();
}

function removeSlot(id) {
  return sessionManager.removeSlot(id);
}

module.exports = {
  getStatus,
  createSlot,
  removeSlot
};
