function clean(jid) {
  return String(jid || "").split(":")[0];
}

function sameJid(a, b) {
  if (!a || !b) return false;

  const aa = clean(a);
  const bb = clean(b);

  if (aa === bb) return true;

  const an = aa.split("@")[0];
  const bn = bb.split("@")[0];

  return an === bn;
}

function findParticipant(metadata, ...jids) {
  const participants = metadata?.participants || [];

  return participants.find(p => {
    return [p.id, p.phoneNumber, p.lid].some(pid =>
      jids.some(jid => sameJid(pid, jid))
    );
  });
}

async function getGroupAdmin(sock, jid) {
  const metadata = await sock.groupMetadata(jid);

  const botId = sock.user?.id || "";
  const botLid = sock.user?.lid || "";

  const bot = findParticipant(
    metadata,
    botId,
    botLid
  );

  return {
    metadata,
    participant: bot,
    isAdmin: !!bot?.admin,
    isSuperAdmin: bot?.admin === "superadmin"
  };
}

async function getSenderAdmin(sock, msg, metadata = null) {
  const group = metadata || await sock.groupMetadata(msg.key.remoteJid);

  const sender = msg.key.participant || "";
  const senderAlt = msg.key.participantAlt || "";

  const participant = findParticipant(
    group,
    sender,
    senderAlt
  );

  return {
    metadata: group,
    participant,
    isAdmin: !!participant?.admin,
    isSuperAdmin: participant?.admin === "superadmin"
  };
}

module.exports = {
  getGroupAdmin,
  getSenderAdmin
};
