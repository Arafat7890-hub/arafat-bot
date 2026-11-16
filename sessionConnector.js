const path = require("path");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestWaWebVersion
} = require("@whiskeysockets/baileys");

const sessionManager = require("./sessionManager");

const sockets = new Map();
const latestQr = new Map();
const reconnecting = new Set();

async function startSession(slotId) {
  const id = String(slotId);

  if (!sessionManager.getSlot(id)) {
    throw new Error(`Slot ${id} does not exist`);
  }

  if (sockets.has(id)) {
    return sockets.get(id);
  }

  const authDir = path.join(
    __dirname,
    "..",
    "sessions",
    `slot-${id}`
  );

  const { state, saveCreds } =
    await useMultiFileAuthState(authDir);

  const { version } = await fetchLatestWaWebVersion();
  console.log("🌐 LIVE WA VERSION:", version.join("."));

  const sock = makeWASocket({
    auth: state,
    version,
    browser: ["Mac OS", "Chrome", "14.4.1"],
    printQRInTerminal: false,
    markOnlineOnConnect: false,
    cachedGroupMetadata: async (jid) =>
      global.arafatGroupCache?.get(jid),
    logger: require("pino")({ level: "warn" })
  });

  sockets.set(id, sock);
  sessionManager.setStatus(id, "connecting");

  sock.ev.on("creds.update", saveCreds);

  let pairingRequested = false;

  sock.ev.on("connection.update", async ({ connection, qr, lastDisconnect }) => {

    if (qr && !state.creds.registered && !pairingRequested) {
      pairingRequested = true;

      try {
        const code = await sock.requestPairingCode("8801890492613");
        console.log(`\\n🔐 𝗔𝗥𝗔𝗙𝗔𝗧 𝗕𝗕𝗭 𝗣𝗔𝗜𝗥𝗜𝗡𝗚 𝗖𝗢𝗗𝗘: ${code}\\n`);
      } catch (e) {
        pairingRequested = false;
        console.log("❌ Pairing error:", e.message);
      }
    }

    if (connection === "open") {
      sessionManager.setStatus(id, "connected");
      console.log(`🟢 SESSION ${id} CONNECTED`);
    }

    if (connection === "close") {
      sockets.delete(id);
      latestQr.delete(id);

      const code =
        lastDisconnect?.error?.output?.statusCode;

      if (code === DisconnectReason.loggedOut) {
        reconnecting.delete(id);
        sessionManager.setStatus(id, "logged_out");
        console.log(`🔴 SESSION ${id} LOGGED OUT`);
        return;
      }

      if (reconnecting.has(id)) {
        console.log(`⏳ SESSION ${id} RECONNECT ALREADY RUNNING`);
        return;
      }

      reconnecting.add(id);
      sessionManager.setStatus(id, "connecting");
      console.log(`🔄 SESSION ${id} AUTO RECONNECTING...`);

      setTimeout(async () => {
        try {
          await startSession(id);
        } catch (err) {
          console.log(`❌ SESSION ${id} RECONNECT FAILED:`, err.message);
        } finally {
          reconnecting.delete(id);
        }
      }, 3000);
    }
  });

  return sock;
}

async function requestPairingCode(slotId, phoneNumber) {
  const id = String(slotId);
  const sock = sockets.get(id);

  if (!sock) throw new Error(`Session ${id} is not started`);

  const phone = String(phoneNumber || "").replace(/\D/g, "");
  if (!phone) throw new Error("Phone number required");

  if (sock.authState?.creds?.registered) {
    throw new Error("This slot is already registered");
  }

  return new Promise((resolve, reject) => {
    let done = false;
    let requested = false;

    const finish = (fn, value) => {
      if (done) return;
      done = true;
      sock.ev.off("connection.update", handler);
      fn(value);
    };

    const handler = async ({ connection, qr, lastDisconnect }) => {
      if (qr && !requested && !done) {
        requested = true;

        try {
          const code = await sock.requestPairingCode(phone);
          console.log(`🔐 SESSION ${id} PAIR CODE: ${code}`);
          finish(resolve, code);
        } catch (err) {
          finish(reject, err);
        }
      }

      if (connection === "close" && !done) {
        const code = lastDisconnect?.error?.output?.statusCode;
        finish(
          reject,
          new Error(
            code
              ? `Connection closed (code ${code})`
              : "Connection closed before pairing code"
          )
        );
      }
    };

    sock.ev.on("connection.update", handler);

    if (latestQr.has(id) && !requested && !done) {
      requested = true;
      sock.requestPairingCode(phone).then(code => {
        console.log(`🔐 SESSION ${id} PAIR CODE: ${code}`);
        finish(resolve, code);
      }).catch(err => finish(reject, err));
    }
  });
}

function getSession(id) {
  return sockets.get(String(id)) || null;
}

function getSessions() {
  return sockets;
}

module.exports = {
  startSession,
  requestPairingCode,
  getSession,
  getSessions
};
