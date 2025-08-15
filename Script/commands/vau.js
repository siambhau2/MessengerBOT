const axios = require("axios");
const sessions = new Map();

const GOOGLE_API_KEY = "AIzaSyDB1C1voxsVqwRlhoPhu6XHoIF2eWtUoIA";
const SEARCH_ENGINE_ID = "66a3245697d964206";

module.exports = {
  config: {
    name: "vau",
    version: "1.0.0",
    author: "Siam Bhau",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Google image, web & YouTube search" },
    longDescription: { en: "Search Google images, websites, and YouTube videos" },
    category: "utility",
    guide: { en: "{p}siam pic Messi-3\n{p}siam web Ronaldo-2\n{p}siam video Neymar-4" }
  },

  onStart: async function({ message, args, event }) {
    if (!args[0]) return message.reply("❗ Usage:\n/siam pic Messi-3\n/siam web Ronaldo-2\n/siam video Neymar-4");

    const type = args[0].toLowerCase();
    const rest = args.slice(1).join(" ");
    const matched = rest.match(/(.+)-(\d+)$/);

    if (!matched) return message.reply("❗ Format error! Use: /siam [pic|web|video] <query>-<limit>");

    const query = matched[1].trim();
    const limit = Math.min(parseInt(matched[2]), 10);

    try {
      if (type === "pic") {
        const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&searchType=image&num=${limit}`;
        const res = await axios.get(url);
        const items = res.data.items || [];
        if (items.length === 0) return message.reply("😞 No images found!");

        const attachments = await Promise.all(
          items.map(i => axios.get(i.link, { responseType: "stream" }).then(r => r.data).catch(() => null))
        );

        return message.reply({
          body: `📸 Showing ${items.length} images for "${query}"`,
          attachment: attachments.filter(Boolean)
        });

      } else if (type === "web") {
        const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&num=${limit}`;
        const res = await axios.get(url);
        const items = res.data.items || [];
        if (items.length === 0) return message.reply("😞 No websites found!");

        const text = items.map((i, idx) => `${idx + 1}. ${i.title}\n${i.link}\n${i.snippet}`).join("\n\n");
        return message.reply(`🌐 Results for "${query}":\n\n${text}`);

      } else if (type === "video") {
        const ytUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${limit}&q=${encodeURIComponent(query)}&type=video&key=${GOOGLE_API_KEY}`;
        const res = await axios.get(ytUrl);
        const items = res.data.items || [];
        if (items.length === 0) return message.reply("😞 No videos found!");

        const links = items.map(v => `https://youtube.com/watch?v=${v.id.videoId}`);
        sessions.set(event.messageID, links);

        const listText = items.map((v, i) => `${i + 1}. ${v.snippet.title}`).join("\n");

        return message.reply(`🎥 Showing ${items.length} videos for "${query}":\n\n${listText}\n\n💬 Reply with number to get link.`);
      } else {
        return message.reply("❌ Invalid type! Use pic / web / video");
      }
    } catch (err) {
      console.error("Error:", err.message);
      return message.reply("❌ Something went wrong!");
    }
  },

  onChat: async function({ message, event }) {
    const num = parseInt(message.body.trim());
    const links = sessions.get(event.messageReply?.messageID);
    if (!links || isNaN(num) || num < 1 || num > links.length) return;
    return message.reply(`▶️ Your video link:\n${links[num - 1]}`);
  }
};
