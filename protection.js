const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "..", "data", "protection.json");

if (!fs.existsSync(path.dirname(FILE))) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
}

let config = {};

try {
  config = JSON.parse(fs.readFileSync(FILE, "utf8"));
} catch {
  config = {};
}

const flood = new Map();
const joins = new Map();

function save() {
  fs.writeFileSync(FILE, JSON.stringify(config, null, 2));
}

function get(jid) {
  if (!config[jid]) {
    config[jid] = {
      antiflood: false,
      antiraid: false,
      antibadword: false,
      antibot: false,

      antilink: false,
      antilinkMode: "all",

      antisticker: false,
      antistickerMode: "all",

      antistatus: false,

      botlist: [],
      badwords: []
    };

    save();
  } else {
    // Existing groups: add only missing settings.
    // Existing ON/OFF states will NOT be changed.
    let changed = false;

    if (typeof config[jid].antilink !== "boolean") {
      config[jid].antilink = false;
      changed = true;
    }

    if (!config[jid].antilinkMode) {
      config[jid].antilinkMode = "all";
      changed = true;
    }

    if (typeof config[jid].antisticker !== "boolean") {
      config[jid].antisticker = false;
      changed = true;
    }

    if (!config[jid].antistickerMode) {
      config[jid].antistickerMode = "all";
      changed = true;
    }

    if (typeof config[jid].antistatus !== "boolean") {
      config[jid].antistatus = false;
      changed = true;
    }

    if (!Array.isArray(config[jid].botlist)) {
      config[jid].botlist = [];
      changed = true;
    }

    if (!Array.isArray(config[jid].badwords)) {
      config[jid].badwords = [];
      changed = true;
    }

    if (changed) {
      save();
    }
  }

  return config[jid];
}

function set(jid, key, value) {
  const c = get(jid);

  c[key] = value;

  save();

  return c;
}

function checkFlood(jid, sender, limit = 8, windowMs = 10000) {
  const key = `${jid}:${sender}`;
  const now = Date.now();

  let x = flood.get(key);

  if (!x || now - x.start > windowMs) {
    x = {
      start: now,
      count: 0
    };
  }

  x.count++;

  flood.set(key, x);

  if (x.count > limit) {
    return {
      triggered: true,
      count: x.count
    };
  }

  return {
    triggered: false,
    count: x.count
  };
}

function checkJoinRaid(jid, count, windowMs = 15000, limit = 5) {
  const now = Date.now();

  let x = joins.get(jid);

  if (!x || now - x.start > windowMs) {
    x = {
      start: now,
      count: 0
    };
  }

  x.count += count;

  joins.set(jid, x);

  return {
    triggered: x.count >= limit,
    count: x.count
  };
}

function isKnownBot(jid, participant) {
  const c = get(jid);

  if (!c.antibot || !Array.isArray(c.botlist)) {
    return false;
  }

  const id = String(participant || "").toLowerCase();

  return c.botlist.some(
    x => String(x || "").toLowerCase() === id
  );
}

function addBot(jid, participant) {
  const c = get(jid);
  const id = String(participant || "").trim();

  if (!id) return false;

  if (!Array.isArray(c.botlist)) {
    c.botlist = [];
  }

  if (!c.botlist.includes(id)) {
    c.botlist.push(id);
    save();
  }

  return true;
}

function removeBot(jid, participant) {
  const c = get(jid);

  c.botlist = (c.botlist || []).filter(
    x =>
      String(x).toLowerCase() !==
      String(participant).toLowerCase()
  );

  save();

  return true;
}

function checkBadword(jid, text) {
  const c = get(jid);

  if (
    !c.antibadword ||
    !Array.isArray(c.badwords) ||
    !text
  ) {
    return null;
  }

  const lower = text.toLowerCase();

  return (
    c.badwords.find(
      word =>
        word &&
        lower.includes(String(word).toLowerCase())
    ) || null
  );
}

module.exports = {
  get,
  set,
  checkFlood,
  checkJoinRaid,
  checkBadword,
  isKnownBot,
  addBot,
  removeBot
};
