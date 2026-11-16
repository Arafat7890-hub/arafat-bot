const { jidNormalizedUser } = require("@whiskeysockets/baileys");

const state = {
  enabled: true,
  strikes: new Map(),
  windowMs: 30 * 60 * 1000
};

// Common bot-style command signatures.
// এটা 100% bot detection না—false positive কমানোর জন্য সীমিত রাখা হয়েছে।
const BOT_PATTERNS = [
  /^(?:\.|!|\/|#)(?:menu|help|ping|alive|start|owner|bot|info)\b/i,
  /^(?:\.|!|\/|#)(?:play|song|music|yt|youtube|tiktok|fb|facebook|ig|instagram)\b/i,
  /^(?:\.|!|\/|#)(?:sticker|s|toimg|tourl|img|video|audio)\b/i,
  /^(?:\.|!|\/|#)(?:ai|gpt|gemini|chat|ask|translate)\b/i,
  /^(?:\.|!|\/|#)(?:group|admin|kick|ban|promote|demote|tagall)\b/i
];

function getText(msg) {
  const m = msg?.message || {};
  return (
    m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    ""
  ).trim();
}

function isBotLike(text) {
  if (!text) return false;
  return BOT_PATTERNS.some(re => re.test(text));
}

function sameUser(a, b) {
  if (!a || !b) return false;

  try {
    return jidNormalizedUser(a) === jidNormalizedUser(b);
  } catch {
    return String(a).split(":")[0] === String(b).split(":")[0];
  }
}

function isAdmin(meta, jid) {
  const p = meta?.participants?.find(x => sameUser(x.id, jid));
  return !!p?.admin || !!p?.isAdmin || !!p?.isSuperAdmin;
}

function botIsAdmin(sock, meta) {
  const botJid = sock?.user?.id;
  if (!botJid) return false;
  return isAdmin(meta, botJid);
}

function key(groupJid, userJid) {
  return `${groupJid}|${userJid}`;
}

async function check(sock, msg, meta) {
  if (!state.enabled) return { detected: false };

  const groupJid = msg?.key?.remoteJid;
  const sender = msg?.key?.participant;

  if (!groupJid?.endsWith("@g.us") || !sender) {
    return { detected: false };
  }

  // নিজের bot-এর message বাদ
  if (msg?.key?.fromMe) {
    return { detected: false };
  }

  // Admin হলে বাদ
  if (isAdmin(meta, sender)) {
    return { detected: false };
  }

  // Bot admin না হলে remove করার চেষ্টা করবে না
  if (!botIsAdmin(sock, meta)) {
    return { detected: false, reason: "BOT_NOT_ADMIN" };
  }

  const text = getText(msg);

  if (!isBotLike(text)) {
    return { detected: false };
  }

  const k = key(groupJid, sender);
  const now = Date.now();

  let record = state.strikes.get(k);

  if (!record || now - record.last > state.windowMs) {
    record = {
      count: 0,
      last: now
    };
  }

  record.count++;
  record.last = now;
  state.strikes.set(k, record);

  // প্রথম detection = warning
  if (record.count === 1) {
    await sock.sendMessage(groupJid, {
      text:
        `⚠️ *ANTI-BOT WARNING*\n\n` +
        `@${sender.split("@")[0]} এই গ্রুপে bot-like command detected হয়েছে।\n` +
        `আরেকবার একই ধরনের activity detected হলে আপনাকে group থেকে remove করা হবে।`,
      mentions: [sender]
    });

    return {
      detected: true,
      action: "warning",
      count: 1
    };
  }

  // দ্বিতীয় detection = remove
  if (record.count >= 2) {
    state.strikes.delete(k);

    try {
      await sock.groupParticipantsUpdate(
        groupJid,
        [sender],
        "remove"
      );

      await sock.sendMessage(groupJid, {
        text:
          `🚫 *ANTI-BOT ACTION*\n\n` +
          `@${sender.split("@")[0]} দ্বিতীয়বার bot-like activity detected হওয়ায় group থেকে remove করা হয়েছে।`,
        mentions: [sender]
      });

      return {
        detected: true,
        action: "removed",
        count: record.count
      };
    } catch (error) {
      console.log("❌ AntiBot remove:", error.message);

      await sock.sendMessage(groupJid, {
        text:
          `⚠️ *ANTI-BOT*\n\n` +
          `Bot activity detected হয়েছে, কিন্তু member remove করা যায়নি।`
      });

      return {
        detected: true,
        action: "remove_failed",
        error: error.message
      };
    }
  }

  return {
    detected: true,
    action: "warning",
    count: record.count
  };
}

function setEnabled(value) {
  state.enabled = !!value;

  if (!state.enabled) {
    state.strikes.clear();
  }
}

function isEnabled() {
  return state.enabled;
}

function reset() {
  state.strikes.clear();
}

module.exports = {
  check,
  setEnabled,
  isEnabled,
  reset,
  isBotLike
};
