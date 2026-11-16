const protection = require("../lib/protection");
const statusProtection = require("../lib/groupStatusProtection");

async function isGroupAdmin(sock, jid, user) {
  try {
    const metadata = await sock.groupMetadata(jid);

    const p = (metadata.participants || []).find(
      x =>
        x.id === user ||
        x.jid === user ||
        x.lid === user ||
        x.phoneNumber === user
    );

    return !!(
      p?.admin ||
      p?.isAdmin ||
      p?.isSuperAdmin
    );
  } catch {
    return false;
  }
}

module.exports = {
  name: "antistatus",
  aliases: ["antistatuson"],
  category: "Group",
  description: "Group Status protection",

  async execute(sock, msg, args) {
    const jid = msg.key?.remoteJid || "";

    if (!jid.endsWith("@g.us")) {
      return sock.sendMessage(jid, {
        text: "❌ এই command শুধু Group-এ ব্যবহার করা যাবে।"
      });
    }

    const sender =
      msg.key?.participant ||
      msg.key?.participantAlt ||
      "";

    if (!(await isGroupAdmin(sock, jid, sender))) {
      return sock.sendMessage(jid, {
        text: "❌ এই setting পরিবর্তন করতে Group Admin হতে হবে।"
      });
    }

    const action = (args[0] || "").toLowerCase();
    const value = (args[1] || "").toLowerCase();

    if (action === "on") {
      statusProtection.setMode(jid, "member");

      return sock.sendMessage(jid, {
        text:
          "🛡️ 𝗔𝗡𝗧𝗜𝗦𝗧𝗔𝗧𝗨𝗦: ON 🟢\n\n" +
          "👤 Mode: MEMBER\n" +
          "🚫 Members-এর Group Status automatically delete হবে."
      });
    }

    if (action === "off") {
      statusProtection.disable(jid);

      return sock.sendMessage(jid, {
        text: "🛡️ 𝗔𝗡𝗧𝗜𝗦𝗧𝗔𝗧𝗨𝗦: OFF 🔴"
      });
    }

    if (action === "mode") {
      if (!["member", "admin", "all"].includes(value)) {
        return sock.sendMessage(jid, {
          text:
            "❌ Invalid mode.\n\n" +
            ".antistatus mode member\n" +
            ".antistatus mode admin\n" +
            ".antistatus mode all"
        });
      }

      statusProtection.setMode(jid, value);

      const label = {
        member: "MEMBER 👤",
        admin: "ADMIN 🛡️",
        all: "ALL 👥"
      }[value];

      return sock.sendMessage(jid, {
        text:
          "🛡️ 𝗔𝗡𝗧𝗜𝗦𝗧𝗔𝗧𝗨𝗦 𝗠𝗢𝗗𝗘\n\n" +
          `⚡ ${label}\n\n` +
          "✅ Setting updated successfully."
      });
    }

    if (action === "status") {
      const cfg = protection.get(jid);
      const mode = statusProtection.getMode(jid);

      return sock.sendMessage(jid, {
        text:
          "🛡️ 𝗔𝗡𝗧𝗜𝗦𝗧𝗔𝗧𝗨𝗦 𝗦𝗧𝗔𝗧𝗨𝗦\n\n" +
          `Protection: ${cfg?.antistatus ? "ON 🟢" : "OFF 🔴"}\n` +
          `Mode: ${mode.toUpperCase()}\n\n` +
          "member = শুধু members\n" +
          "admin = শুধু admins\n" +
          "all = admins + members"
      });
    }

    return sock.sendMessage(jid, {
      text:
        "╭──〔 🛡️ 𝗔𝗡𝗧𝗜𝗦𝗧𝗔𝗧𝗨𝗦 〕──╮\n" +
        "├─ .antistatus on\n" +
        "├─ .antistatus off\n" +
        "├─ .antistatus mode member\n" +
        "├─ .antistatus mode admin\n" +
        "├─ .antistatus mode all\n" +
        "├─ .antistatus status\n" +
        "╰────────────────────╯"
    });
  }
};
