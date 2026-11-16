
const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "data", "groupfeatures.json");

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

function get(jid) {
  const data = load();

  if (!data[jid]) {
    data[jid] = {
      welcome: false,
      goodbye: false,
      welcome2: false,
      goodbye2: false,
      autogcstatus: false,
      antilinkgc: false,
      linklock: false,
      antitoxic: false
    };

    save(data);
  }

  return data[jid];
}

function set(jid, key, value) {
  const data = load();

  if (!data[jid]) {
    data[jid] = {};
  }

  data[jid][key] = value;
  save(data);

  return data[jid];
}

module.exports = { get, set };
