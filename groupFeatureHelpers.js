
function getText(msg) {
  return (
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    msg.message?.imageMessage?.caption ||
    msg.message?.videoMessage?.caption ||
    ""
  );
}

async function isGroupAdmin(sock, jid, msg) {
  if (!jid?.endsWith("@g.us")) return false;

  try {
    const meta = await sock.groupMetadata(jid);

    const sender =
      msg.key?.participant ||
      msg.key?.remoteJid ||
      "";

    const me =
      sock.user?.id?.split(":")[0] ||
      "";

    const clean = x =>
      String(x || "")
        .replace(/:\d+@/, "@")
        .replace(/@lid$/, "")
        .replace(/@s.whatsapp.net$/, "");

    const senderId = clean(sender);
    const botId = clean(me);

    if (senderId && senderId === botId) return true;

    const participant = meta.participants?.find(
      p =>
        clean(p.id) === senderId ||
        clean(p.jid) === senderId
    );

    return !!(
      participant &&
      (participant.admin === "admin" ||
       participant.admin === "superadmin")
    );
  } catch {
    return false;
  }
}

module.exports = { getText, isGroupAdmin };
