const axios = require("axios");
const fs = require("fs");
const path = __dirname + "/likeGroupData.json";

if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));

module.exports.config = {
  name: "like",
  version: "1.3",
  hasPermssion: 0,
  credits: "Siam Bhau",
  description: "Send a like to a Free Fire UID using an external API (Daily Limit System)",
  commandCategory: "game",
  usages: "[uid]",
  cooldowns: 5
};


const ownerName = String.fromCharCode(
  83, 105, 97, 109, 32, 66, 104, 97, 117
); 

module.exports.run = async function ({ api, event, args }) {
  const uid = args[0];
  const threadID = event.threadID;
  const senderID = event.senderID;

  const isAdmin = ["100011254804801"].includes(senderID); 

  if (!uid || isNaN(uid)) {
    return api.sendMessage(
      "❌ Please provide a valid Free Fire UID.\n\nExample:\n/like 2579249340",
      threadID,
      event.messageID
    );
  }

  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(path));
  } catch {
    data = {};
  }

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  if (!data[threadID]) {
    data[threadID] = {
      totalLikes: 0,
      users: {},
      lastReset: today
    };
  }

  if (data[threadID].lastReset !== today) {
    data[threadID].totalLikes = 0;
    data[threadID].users = {};
    data[threadID].lastReset = today;
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
  }

  if (!isAdmin) {
    const userLikes = data[threadID].users[senderID] || 0;

    if (userLikes >= 2) {
      return api.sendMessage(
        `⛔ You have reached your daily limit!\nEach user can like only 2 times per day.`,
        threadID,
        event.messageID
      );
    }

    if (data[threadID].totalLikes >= 20) {
      return api.sendMessage(
        `🚫 This group has reached the maximum limit of 20 likes today.`,
        threadID,
        event.messageID
      );
    }
  }

  const url = `FreeFire_Like_Api_URL`;

  try {
    const res = await axios.get(url);
    const d = res.data;

    const name = d?.PlayerNickname || "Unknown";
    const id = d?.UID || uid;
    const likesBefore = d?.LikesbeforeCommand ?? "❓";
    const likesAfter = d?.LikesafterCommand ?? "❓";
    const given = d?.LikesGivenByAPI ?? 1;

    if (d?.LikesafterCommand !== undefined) {

      if (!isAdmin) {
        data[threadID].totalLikes += 1;
        data[threadID].users[senderID] = (data[threadID].users[senderID] || 0) + 1;
      }

      fs.writeFileSync(path, JSON.stringify(data, null, 2));

      const msg =
        `✅ Like sent successfully!\n\n` +
        `👤 Player Name: ${name}\n` +
        `🆔 UID: ${id}\n\n` +
        `❤️ Likes Before: ${likesBefore}\n` +
        `➕ Likes Given: ${given}\n` +
        `🎯 Total Likes Now: ${likesAfter}\n\n` +
        (isAdmin
          ? `👑 Admin Access: No limit applied`
          : `🔁 Your Used Likes: ${data[threadID].users[senderID]}/2\n🔁 Group Remaining Likes: ${20 - data[threadID].totalLikes}`) +
        `\n\n👑 Owner: ${ownerName}`; 

      return api.sendMessage(msg, threadID, event.messageID);
    } else {
      return api.sendMessage(
        `⚠️ Could not verify like success.\nPartial API Response:\n${JSON.stringify(d, null, 2)}`,
        threadID,
        event.messageID
      );
    }
  } catch (error) {
    return api.sendMessage(
      `❌ Request failed!\nError: ${error.message}`,
      threadID,
      event.messageID
    );
  }
};
