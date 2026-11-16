const statusStore = require("../lib/groupStatusStore");

module.exports = {
  name: "deletegcst",
  aliases: ["delgcst", "deletegroupstatus"],
  category: "Group",
  description: "Delete tracked Group Status",

  async execute(sock, msg, args) {
    const jid = msg.key?.remoteJid;

    if (!jid?.endsWith("@g.us")) {
      return sock.sendMessage(jid, {
        text: "❌ এই command শুধু Group-এ ব্যবহার করা যাবে।"
      });
    }

    const mode = String(args[0] || "single").toLowerCase();
    const items = statusStore.get(jid);

    if (!items.length) {
      return sock.sendMessage(jid, {
        text:
          "❌ কোনো tracked Group Status পাওয়া যায়নি।\n\n" +
          "পুরোনো Story-এর reply করলে সেটি automatically track হবে।"
      });
    }

    if (mode === "list") {
      const lines = items.map((x, i) => {
        const id = x.key?.id || "unknown";
        const author = x.key?.participant || "unknown";
        return `${i + 1}. ${id}\n   👤 ${author}`;
      });

      return sock.sendMessage(jid, {
        text:
          "╭┈───〔 𝗚𝗥𝗢𝗨𝗣 𝗦𝗧𝗔𝗧𝗨𝗦 〕┈───⊷\n" +
          `├✦ Tracked: ${items.length}\n` +
          "╰───────────────────⊷\n\n" +
          lines.join("\n")
      });
    }

    if (mode === "single") {
      let target = items[items.length - 1];

      if (args[1]) {
        target = items.find(x => x.key?.id === args[1]);

        if (!target) {
          return sock.sendMessage(jid, {
            text:
              "❌ ওই Status ID পাওয়া যায়নি।\n\n" +
              "`.deletegcst list` দিয়ে ID দেখো।"
          });
        }
      }

      try {
        await sock.sendMessage(jid, {
          delete: target.key
        });

        return sock.sendMessage(jid, {
          text:
            "📤 Group Status delete request পাঠানো হয়েছে.\n\n" +
            `🆔 ${target.key?.id || "unknown"}\n` +
            "ℹ️ Request পাঠানো হয়েছে; WhatsApp-side deletion নিশ্চিত না হওয়া পর্যন্ত target রাখা হয়েছে."
        });
      } catch (e) {
        return sock.sendMessage(jid, {
          text:
            "❌ Group Status delete request পাঠানো যায়নি.\n\n" +
            `⚠️ ${e.message || "Unknown error"}`
        });
      }
    }

    if (mode === "all") {
      let sent = 0;
      let failed = 0;

      for (const item of items) {
        try {
          await sock.sendMessage(jid, {
            delete: item.key
          });
          sent++;
        } catch {
          failed++;
        }
      }

      return sock.sendMessage(jid, {
        text:
          "╭┈───〔 𝗗𝗘𝗟𝗘𝗧𝗘 𝗚𝗥𝗢𝗨𝗣 𝗦𝗧𝗔𝗧𝗨𝗦 〕┈───⊷\n" +
          `├✦ Requests Sent: ${sent}\n` +
          `├✦ Failed: ${failed}\n` +
          `├✦ Still Tracked: ${items.length}\n` +
          "╰───────────────────⊷\n\n" +
          "ℹ️ Delete request পাঠানো হয়েছে; targetগুলো retry করার জন্য রাখা হয়েছে।"
      });
    }

    return sock.sendMessage(jid, {
      text:
        "⚙️ Usage:\n\n" +
        "• .deletegcst all\n" +
        "• .deletegcst single\n" +
        "• .deletegcst single STATUS_ID\n" +
        "• .deletegcst list"
    });
  }
};
