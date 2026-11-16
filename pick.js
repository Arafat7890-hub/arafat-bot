module.exports = {
  name: "pick",
  aliases: ["choose"],
  category: "Fun",
  description: "Randomly pick one option",

  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    if (!args.length) {
      return sock.sendMessage(jid, {
        text: "🎯 ব্যবহার: .pick A | B | C"
      });
    }

    const options = args.join(" ").split("|").map(x => x.trim()).filter(Boolean);

    if (options.length < 2) {
      return sock.sendMessage(jid, {
        text: "❌ অন্তত ২টা option দাও।\n\nউদাহরণ: .pick A | B | C"
      });
    }

    const choice = options[Math.floor(Math.random() * options.length)];

    await sock.sendMessage(jid, {
      text:
        "╭━━━〔 🎯 ᴘɪᴄᴋ 〕━━━╮\n" +
        "┃\n" +
        `┃ ✅ ʀᴇsᴜʟᴛ : ${choice}\n` +
        "┃\n" +
        "╰━━━━━━━━━━━━━━━━╯"
    });
  }
};
