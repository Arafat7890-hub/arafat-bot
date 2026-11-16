const protection = require("./protection");

const VALID_MODES = ["member", "admin", "all"];

function getMode(jid) {
  const cfg = protection.get(jid);
  return cfg?.antistatusMode || "off";
}

function setMode(jid, mode) {
  if (!VALID_MODES.includes(mode)) {
    throw new Error("Invalid antistatus mode");
  }

  protection.set(jid, "antistatus", true);
  protection.set(jid, "antistatusMode", mode);

  return mode;
}

function disable(jid) {
  protection.set(jid, "antistatus", false);
  protection.set(jid, "antistatusMode", "off");
}

function isGroupStatus(msg) {
  const m = msg?.message || {};
  return !!(m.groupStatusMessage || m.groupStatusMessageV2);
}

function getSender(msg) {
  return (
    msg?.key?.participant ||
    msg?.key?.participantAlt ||
    msg?.participant ||
    ""
  );
}

async function isAdmin(sock, groupJid, userJid) {
  try {
    const metadata = await sock.groupMetadata(groupJid);
    const participant = (metadata.participants || []).find(
      p =>
        p.id === userJid ||
        p.jid === userJid ||
        p.lid === userJid ||
        p.phoneNumber === userJid
    );

    return !!(
      participant?.admin ||
      participant?.isAdmin ||
      participant?.isSuperAdmin
    );
  } catch (e) {
    console.log("⚠️ ANTISTATUS ADMIN CHECK:", e.message);
    return false;
  }
}

async function shouldDelete(sock, msg) {
  const groupJid = msg?.key?.remoteJid || "";

  if (!groupJid.endsWith("@g.us")) return false;
  if (!isGroupStatus(msg)) return false;

  const mode = getMode(groupJid);

  if (mode === "off") return false;

  const sender = getSender(msg);

  if (!sender) return false;

  const senderIsAdmin = await isAdmin(sock, groupJid, sender);

  if (mode === "member" && senderIsAdmin) return false;
  if (mode === "admin" && !senderIsAdmin) return false;

  return true;
}

async function handle(sock, msg) {
  if (!(await shouldDelete(sock, msg))) return false;

  const jid = msg.key.remoteJid;
  const sender = getSender(msg);
  const mode = getMode(jid);

  try {
    await sock.sendMessage(jid, {
      delete: msg.key
    });

    console.log(
      "🗑️ ANTISTATUS DELETE:",
      mode,
      sender,
      msg.key?.id
    );

    await sock.sendMessage(jid, {
      text:
        "⚠️ 𝗔𝗡𝗧𝗜𝗦𝗧𝗔𝗧𝗨𝗦 𝗪𝗔𝗥𝗡𝗜𝗡𝗚\n\n" +
        "🚫 Group Status is not allowed in this group.\n" +
        "🗑️ The Group Status was automatically removed."
    });

    return true;
  } catch (e) {
    console.log("❌ ANTISTATUS DELETE ERROR:", e.message);
    return false;
  }
}

module.exports = {
  getMode,
  setMode,
  disable,
  isGroupStatus,
  getSender,
  isAdmin,
  handle
};
