const axios = require("axios");

const GOOGLE_API_KEY = "AIzaSyDB1C1voxsVqwRlhoPhu6XHoIF2eWtUoIA";
const SEARCH_ENGINE_ID = "66a3245697d964206";
const sessions = new Map();

module.exports = {
  config: {
    name: "search",
    version: "1.0.0",
    author: "SiamX",
    shortDescription: {
      en: "Search: web, pic, video"
    },
    longDescription: {
      en: "Use /search [pic|web|video] <keyword>-<limit> to search Google or YouTube"
    },
    category: "utility",
    guide: {
      en: "{p}search pic Messi-5\n{p}search web Ronaldo-3\n{p}search video Neymar-4"
    }
  },

  onStart: async function ({ message, args, event, api }) {
    if (!args[0]) return message.reply(`📌 Usage:\n/search pic Messi-5\n/search web Ronaldo-3\n/search video Neymar-4`);

    const type = args[0].toLowerCase();
    const rest = args.slice(1).join(" ");
    const match = rest.match(/(.+)-(\d+)$/);
    if (!match) return message.reply("⚠️ Use format: /search [type] <query>-<limit>");

    const query = match[1].trim();
    const limit = parseInt(match[2]);

    try {
      if (type === "pic") {
        const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&searchType=image&num=${limit}`;
        const res = await axios.get(url);
        const items = res.data.items || [];

        if (items.length === 0) return message.reply("😞 No images found!");
        const attachments = await Promise.all(items.map(item => global.utils.getStreamFromURL(item.link)));
        return message.reply({
          body: `📸 Showing ${items.length} images for "${query}"`,
          attachment: attachments
        });

      } else if (type === "web") {
        const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&num=${limit}`;
        const res = await axios.get(url);
        const items = res.data.items || [];

        if (items.length === 0) return message.reply("😞 No results found!");
        const text = items.map((item, i) => `${i + 1}. ${item.title}\n${item.link}\n${item.snippet}`).join("\n\n");
        return message.reply(`🔎 Showing ${items.length} results for "${query}":\n\n${text}`);

      } else if (type === "video") {
        const ytUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${limit}&q=${encodeURIComponent(query)}&type=video&key=${GOOGLE_API_KEY}`;
        const res = await axios.get(ytUrl);
        const items = res.data.items || [];

        if (items.length === 0) return message.reply("😞 No videos found!");

        const links = items.map(v => `https://www.youtube.com/watch?v=${v.id.videoId}`);
        sessions.set(event.messageID, links);

        const listText = items.map((v, i) => `${i + 1}. ${v.snippet.title}`).join("\n");
        const thumbs = await Promise.all(items.map(v => global.utils.getStreamFromURL(v.snippet.thumbnails.medium.url)));

        return message.reply({
          body: `🎥 Showing ${items.length} videos for "${query}":\n\n${listText}\n\n💬 Reply with number to get link.`,
          attachment: thumbs
        });

      } else {
        return message.reply("❌ Invalid type! Use: pic / web / video");
      }
    } catch (err) {
      console.error(err);
      return message.reply("❌ Something went wrong while fetching data.");
    }
  },

  onChat: async function ({ message, event }) {
    const reply = message.body.trim();
    const number = parseInt(reply);

    const links = sessions.get(event.messageReply?.messageID);
    if (!links || isNaN(number) || number < 1 || number > links.length) return;

    return message.reply(`▶️ Here's your video:\n${links[number - 1]}`);
  }
};
