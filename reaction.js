async function react(sock, msg, emoji = "⚡") {
  try {
    await sock.sendMessage(msg.key.remoteJid, {
      react: {
        text: emoji,
        key: msg.key
      }
    });
  } catch (error) {
    console.log("⚠️ Reaction error:", error.message);
  }
}

module.exports = { react };
