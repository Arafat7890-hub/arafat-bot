const fs = require("fs");
const path = require("path");

function loadCommands() {
  const commands = new Map();
  const dir = path.join(__dirname, "..", "commands");

  if (!fs.existsSync(dir)) {
    return commands;
  }

  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".js")) continue;

    try {
      const command = require(path.join(dir, file));

      if (!command.name || typeof command.execute !== "function") {
        console.log(`⚠️ Skipped: ${file}`);
        continue;
      }

      commands.set(command.name.toLowerCase(), command);

      if (Array.isArray(command.aliases)) {
        for (const alias of command.aliases) {
          commands.set(alias.toLowerCase(), command);
        }
      }

      console.log(`✅ Loaded: ${command.name}`);
    } catch (error) {
      console.log(`❌ Failed: ${file}`);
      console.log(error.message);
    }
  }

  return commands;
}

module.exports = { loadCommands };
