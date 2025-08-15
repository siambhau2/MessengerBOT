const axios = require("axios");
const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");

const GOOGLE_API_KEY = "AIzaSyDB1C1voxsVqwRlhoPhu6XHoIF2eWtUoIA";
const CUSTOM_SEARCH_ENGINE_ID = "66a3245697d964206";

module.exports.config = {
  name: "siamx123",
  version: "4.0",
  hasPermssion: 0,
  credits: "ChatGPT",
  description: "Google search, image & YouTube video search with download",
  commandCategory: "utility",
  usages: "/siamx123 [web|pic|video] query-limit",
  cooldowns: 3
};

let videoCache = {}; // { threadID: [videoArray] }

module.exports.run = async function ({ api, event, args }) {
  const input = args.join(" ");
  const [type, ...rest] = input.split(" ");
  const [query, limitStr] = rest.join(" ").split("-");
  const limit = parseInt(limitStr) || 5;

  if (!type || !query) {
    return api.sendMessage(
      "❌ উদাহরণ:\n" +
      "/siamx123 web how to make bot-3\n" +
      "/siamx123 pic cat-5\n" +
      "/siamx123 video free fire-2",
      event.threadID,
      event.messageID
    );
  }

  try {
    if (type === "web") {
      const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&cx=${CUSTOM_SEARCH_ENGINE_ID}&num=${limit}`;
      const res = await axios.get(url);
      const items = res.data.items || [];
      if (items.length === 0) return api.sendMessage("❌ কোনো রেজাল্ট পাওয়া যায়নি।", event.threadID, event.messageID);

      const results = items.map((item, i) =>
        `${i + 1}. ${item.title}\n${item.link}\n${item.snippet}`
      ).join("\n\n");

      return api.sendMessage(`🔎 ওয়েব রেজাল্ট:\n\n${results}`, event.threadID, event.messageID);
    }

    else if (type === "pic") {
      const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&cx=${CUSTOM_SEARCH_ENGINE_ID}&searchType=image&num=${limit}`;
      const res = await axios.get(url);
      const items = res.data.items || [];
      if (items.length === 0) return api.sendMessage("❌ কোনো ছবি পাওয়া যায়নি।", event.threadID, event.messageID);

      const attachments = await Promise.all(items.map(async (item) => {
        try {
          const imgRes = await axios.get(item.link, { responseType: "arraybuffer" });
          const filePath = path.join(__dirname, `temp_${Date.now()}_${Math.random()}.jpg`);
          fs.writeFileSync(filePath, imgRes.data);
          return fs.createReadStream(filePath);
        } catch (e) {
          return null;
        }
      }));

      return api.sendMessage({
        body: `🖼️ ${query} এর ${limit}টি ছবি:`,
        attachment: attachments.filter(Boolean)
      }, event.threadID, event.messageID);
    }

    else if (type === "video") {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${limit}&q=${encodeURIComponent(query)}&type=video&key=${GOOGLE_API_KEY}`;
      const res = await axios.get(url);
      const items = res.data.items || [];
      if (items.length === 0) return api.sendMessage("❌ কোনো ভিডিও পাওয়া যায়নি।", event.threadID, event.messageID);

      const msg = items.map((item, i) => `${i + 1}. ${item.snippet.title}`).join("\n");

      const attachments = await Promise.all(items.map(async (item) => {
        const thumbUrl = item.snippet.thumbnails.high.url;
        try {
          const response = await axios.get(thumbUrl, { responseType: "arraybuffer" });
          const tempPath = path.join(__dirname, `thumb_${Date.now()}_${Math.random()}.jpg`);
          fs.writeFileSync(tempPath, response.data);
          return fs.createReadStream(tempPath);
        } catch {
          return null;
        }
      }));

      videoCache[event.threadID] = items;

      return api.sendMessage({
        body: `📹 ${query} এর ভিডিও লিস্ট:\n\n${msg}\n\n👉 যেটা দেখতে চাও, সেই নাম্বারটি রিপ্লাই করো`,
        attachment: attachments.filter(Boolean)
      }, event.threadID, (err, info) => {
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: event.senderID,
          type: "video",
          query,
          threadID: event.threadID
        });
      });
    }

    else {
      return api.sendMessage("❌ টাইপ দিতে হবে: web, pic, বা video", event.threadID, event.messageID);
    }

  } catch (err) {
    console.error("❌ ERROR:", err.message);
    return api.sendMessage("❌ সার্ভার সমস্যার কারণে কাজ হয়নি।", event.threadID, event.messageID);
  }
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  const index = parseInt(event.body);
  if (isNaN(index)) return;

  const list = videoCache[handleReply.threadID];
  if (!list || !list[index - 1]) return api.sendMessage("❌ সঠিক নাম্বার দাও!", event.threadID, event.messageID);

  const video = list[index - 1];
  const videoId = video.id.videoId;
  const videoTitle = video.snippet.title;
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const fileName = `video_${videoId}.mp4`;
  const filePath = path.join(__dirname, fileName);

  try {
    const stream = ytdl(videoUrl, { filter: "audioandvideo", quality: "18" });
    const writable = fs.createWriteStream(filePath);
    stream.pipe(writable);

    stream.on("end", () => {
      api.sendMessage({
        body: `🎬 ${videoTitle}`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => fs.unlinkSync(filePath));
    });

    stream.on("error", () => {
      api.sendMessage("❌ ভিডিও ডাউনলোডে সমস্যা হয়েছে!", event.threadID, event.messageID);
    });
  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ ভিডিও আনতে সমস্যা হয়েছে!", event.threadID, event.messageID);
  }
};
