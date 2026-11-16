const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);

module.exports = {
  name: "vivid",
  aliases: ["vividify", "colorboost"],
  category: "Media",
  description: "Natural iPhone-style vivid enhancement",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted?.imageMessage) {
      return sock.sendMessage(jid, {
        text: "🖼️ একটি ছবিতে reply করে `.vivid` দাও।"
      });
    }

    const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const input = path.join(os.tmpdir(), `vivid_in_${id}`);
    const output = path.join(os.tmpdir(), `vivid_out_${id}.jpg`);

    try {
      const stream = await downloadContentFromMessage(
        quoted.imageMessage,
        "image"
      );

      const chunks = [];
      for await (const chunk of stream) chunks.push(chunk);

      fs.writeFileSync(input, Buffer.concat(chunks));

      await execFileAsync("magick", [
        input,
        "-auto-orient",
        "-colorspace", "sRGB",

        // Natural brightness + moderate contrast
        "-brightness-contrast", "2x5",

        // More color, but not cartoonish
        "-modulate", "103,118,100",

        // Gentle clarity
        "-unsharp", "0x0.45+0.45+0.01",

        "-quality", "100",
        output
      ]);

      const result = fs.readFileSync(output);

      await sock.sendMessage(jid, {
        image: result,
        mimetype: "image/jpeg",
        caption:
          "✨ ᴠɪᴠɪᴅ ɴᴀᴛᴜʀᴀʟ\n\n" +
          "🤍 sᴋɪɴ ᴛᴏɴᴇ ɴᴀᴛᴜʀᴀʟ\n" +
          "🎨 ᴄᴏʟᴏʀ ʙᴏᴏsᴛᴇᴅ\n" +
          "💎 sᴏғᴛ ᴄʟᴀʀɪᴛʏ\n" +
          "📐 ᴏʀɪɢɪɴᴀʟ ʀᴇsᴏʟᴜᴛɪᴏɴ"
      });

    } catch (e) {
      console.log("❌ Vivid:", e.stderr || e.message);

      await sock.sendMessage(jid, {
        text: "❌ ছবিটি process করা যায়নি।"
      });

    } finally {
      try { fs.unlinkSync(input); } catch {}
      try { fs.unlinkSync(output); } catch {}
    }
  }
};
