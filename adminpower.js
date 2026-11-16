module.exports = {
  name: "adminpower",
  aliases: ["adminpanel", "adminpower"],
  category: "Group",
  description: "Admin permission dashboard",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    if (!jid?.endsWith("@g.us")) {
      return sock.sendMessage(jid, {
        text: "❌ এই command শুধু Group-এ ব্যবহার করা যাবে।"
      });
    }

    try {
      const meta = await sock.groupMetadata(jid);
      const members = meta.participants || [];

      const admins = members.filter(p =>
        p.admin === "admin" ||
        p.admin === "superadmin" ||
        p.isAdmin ||
        p.isSuperAdmin
      );

      const lines = admins.map((p, i) => {
        const number = String(p.phoneNumber || p.id || "")
          .split("@")[0]
          .split(":")[0];

        const role =
          p.admin === "superadmin" || p.isSuperAdmin
            ? "Owner"
            : "Admin";

        return `├─ ${i + 1}. ${number} — ${role}`;
      });

      const text =
`╭──〔 𝗔𝗗𝗠𝗜𝗡 𝗣𝗢𝗪𝗘𝗥 〕──╮
│
├─ 𝗧ᴏᴛᴀʟ 𝗔ᴅᴍɪɴs : ${admins.length}
│
${lines.join("\n")}
│
╰────────────────────────╯`;

      return sock.sendMessage(jid, { text });
    } catch (e) {
      return sock.sendMessage(jid, {
        text: `❌ Admin Power error.\n\n⚠️ ${e.message}`
      });
    }
  }
};
