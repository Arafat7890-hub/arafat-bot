const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "..", "protection-settings.json");

const DEFAULTS = {
  antibot: true,
  antiflood: true,
  antiraid: true,
  antibadword: true,
  antilink: false,
  antisticker: false,
  antistatus: false
};

function load() {
  try {
    if (!fs.existsSync(FILE)) {
      fs.writeFileSync(FILE, JSON.stringify(DEFAULTS, null, 2));
      return { ...DEFAULTS };
    }

    const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

    return {
      ...DEFAULTS,
      ...data
    };
  } catch (e) {
    console.log("⚠️ Protection settings load:", e.message);
    return { ...DEFAULTS };
  }
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function get(name) {
  return !!load()[name];
}

function set(name, value) {
  const data = load();
  data[name] = !!value;
  save(data);
  return data[name];
}

function all() {
  return load();
}

module.exports = {
  get,
  set,
  all,
  DEFAULTS
};
