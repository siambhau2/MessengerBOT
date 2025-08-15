const axios = require("axios");
const fs = require("fs");
const path = require("path");

const GOOGLE_API_KEY = "AIzaSyDB1C1voxsVqwRlhoPhu6XHoIF2eWtUoIA";
const CUSTOM_SEARCH_ENGINE_ID = "66a3245697d964206";

module.exports = {
  config: {
    name: "siam",
    aliases: [],
    version: "1.0",
    author: " Siam",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Google, image, and YouTube search"
    },
    longDescription: {
      en: "Search Google Web, Images or YouTube Videos"
    },
    category: "utility",
    guide: {
      en: "/siam web query-5\n/siam pic query-3\n/siam video query-5"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const input = args.join(" ");
    const [type, ...rest] = input.split(" ");
    const [query, limitStr] = rest.join(" ").split("-");
    const limit = parseInt(limitStr) || 5;

    if (!type || !query) {
      return message.reply("❌ উদাহরণ:\n/siam web how to make bot-3\n/siam pic cat-5\n/siam video free fire-2");
    }

    try {
      if (type === "web") {
        const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&cx=${CUSTOM_SEARCH_ENGINE_ID}&num=${limit}`;
        const res = await axios.get(url);
        const items = res.data.items || [];
        if (items.length === 0) return message.reply("❌ কোনো রেজাল্ট পাওয়া যায়নি।");

        const results = items.map((item, i) =>
          `${i + 1}. ${item.title}\n${item.link}\n${item.snippet}`
        ).join("\n\n");

        return message.reply(`🔍 ওয়েব রেজাল্ট:\n\n${results}`);
      }

      else if (type === "pic") {
        const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&cx=${CUSTOM_SEARCH_ENGINE_ID}&searchType=image&num=${limit}`;
        const res = await axios.get(url);
        const items = res.data.items || [];

        if (items.length === 0) return message.reply("❌ কোনো ছবি পাওয়া যায়নি।");

        const attachments = await Promise.all(items.map(async (item) => {
          try {
            const imgRes = await axios.get(item.link, { responseType: "arraybuffer" });
            const tempPath = path.join(__dirname, `temp_${Date.now()}_${Math.random()}.jpg`);
            fs.writeFileSync(tempPath, imgRes.data);
            return fs.createReadStream(tempPath);
          } catch (e) {
            return null;
          }
        }));

        return message.reply({
          body: `🖼️ ${query} এর ${limit}টি ছবি:`,
          attachment: attachments.filter(Boolean)
        });
      }

      else if (type === "video") {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${limit}&q=${encodeURIComponent(query)}&type=video&key=${GOOGLE_API_KEY}`;
        const res = await axios.get(url);
        const items = res.data.items || [];

        if (items.length === 0) return message.reply("❌ কোনো ভিডিও পাওয়া যায়নি।");

        const results = items.map((item, i) => {
          const title = item.snippet.title;
          const videoId = item.id.videoId;
          const link = `https://www.youtube.com/watch?v=${videoId}`;
          return `${i + 1}. ${title}\n${link}`;
        }).join("\n\n");

        return message.reply(`📹 ${query} এর ভিডিও:\n\n${results}`);
      }

      else {
        return message.reply("❌ টাইপ দিতে হবে: web, pic, বা video");
      }

    } catch (err) {
      console.error("❌ Error in siam module:", err.message);
      return message.reply("❌ সার্ভারে সমস্যা হয়েছে!");
    }
  }
};
