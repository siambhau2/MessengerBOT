const axios = require("axios");
const fs = require("fs");
const https = require("https");

function formatDate(ts) {
  if (!ts) return "N/A";
  const date = new Date(parseInt(ts) * 1000);
  return date.toLocaleString("en-GB", { timeZone: "Asia/Dhaka" });
}

module.exports.config = {
  name: "bhau",
  version: "2.2",
  author: "Siam Bhau + ChatGPT",
  description: "Free Fire full account info using UID and outfit image",
  usage: "/bhau <uid>",
  commandCategory: "game",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const uid = args[0];
  if (!uid) return api.sendMessage("❌ UID দাও\n\nব্যবহার:\n/bhau <uid>", event.threadID, event.messageID);

  try {
    const { data } = await axios.get(`INFO_API_LINK`);
    if (!data?.basicInfo) return api.sendMessage("❌ ইউজার খুঁজে পাওয়া যায়নি!", event.threadID, event.messageID);

    const {
      nickname, region, level, exp, liked, rank, csRank, badgeCnt, maxRank, csMaxRank, releaseVersion,
      bannerId, headPic, pinId, title, weaponSkinShows, badgeId, seasonId, createAt, lastLoginAt,
      showBrRank, showCsRank, externalIconInfo
    } = data.basicInfo;

    const profile = data.profileInfo || {};
    const clan = data.clanBasicInfo || {};
    const captain = data.captainBasicInfo || {};
    const pet = data.petInfo || {};
    const social = data.socialInfo || {};
    const diamondCost = data.diamondCostRes?.diamondCost || 0;
    const creditScore = data.creditScoreInfo?.creditScore || "N/A";
    const creditEnd = data.creditScoreInfo?.periodicSummaryEndTime;

    const msg = 
`🎮 𝗙𝗥𝗘𝗘 𝗙𝗜𝗥𝗘 𝗔𝗖𝗖𝗢𝗨𝗡𝗧 𝗜𝗡𝗙𝗢
━━━━━━━━━━━━━━━
👤 Nickname: ${nickname}
🌍 Region: ${region}
📛 UID: ${uid}
⭐ Level: ${level}
❤️ Likes: ${liked}
🎯 EXP: ${exp}
💎 Diamond Cost: ${diamondCost}
🛡️ Credit Score: ${creditScore}
🕓 Credit End: ${formatDate(creditEnd)}
🎟️ Badge Count: ${badgeCnt}
🏅 Badge ID: ${badgeId}
📆 Season: ${seasonId}
🚀 Version: ${releaseVersion}
🖼️ Banner ID: ${bannerId}
👤 Head Pic ID: ${headPic}
📌 Pin ID: ${pinId}
🏷️ Title ID: ${title}
🔫 Weapon Skins: ${weaponSkinShows?.join(", ") || "N/A"}
📶 BR Rank: ${rank} (Max: ${maxRank})
🥷 CS Rank: ${csRank} (Max: ${csMaxRank})
👁️ Show BR Rank: ${showBrRank}
👁️ Show CS Rank: ${showCsRank}
🌐 External Icon: Status = ${externalIconInfo?.status}, ShowType = ${externalIconInfo?.showType}
📅 Created At: ${formatDate(createAt)}
🔓 Last Login: ${formatDate(lastLoginAt)}

👚 Avatar ID: ${profile.avatarId || "N/A"}
🧥 Clothes: ${profile.clothes?.join(", ") || "N/A"}
🎮 Skills: ${profile.equipedSkills?.join(", ") || "N/A"}
🔫 Primary Weapon: ${profile.pvePrimaryWeapon || "N/A"}
⏱️ End Time: ${profile.endTime || "N/A"}
⏳ Unlock Time: ${profile.unlockTime || "N/A"}
🌟 Marked Star: ${profile.isMarkedStar || "N/A"}
🎨 Tailor Effects: ${profile.clothesTailorEffects?.join(", ") || "N/A"}

🐾 Pet ID: ${pet.id || "N/A"}, Level: ${pet.level || "N/A"}
🎨 Pet Skin ID: ${pet.skinId || "N/A"}
🧠 Pet Skill: ${pet.selectedSkillId || "N/A"}

🏅 Guild: ${clan.clanName || "N/A"} (Lv.${clan.clanLevel || "?"}, ${clan.memberNum || 0}/${clan.capacity || "?"})
🆔 Guild ID: ${clan.clanId || "N/A"}
👑 Captain ID: ${clan.captainId || "N/A"}

🧑‍✈️ Guild Captain:
• Nick: ${captain.nickname || "N/A"}
• Level: ${captain.level || "N/A"}
• EXP: ${captain.exp || "N/A"}
• Likes: ${captain.liked || "N/A"}
• Banner ID: ${captain.bannerId || "N/A"}
• Head Pic ID: ${captain.headPic || "N/A"}
• Rank: ${captain.rank || "N/A"}
• Max BR: ${captain.maxRank || "N/A"}
• Max CS: ${captain.csMaxRank || "N/A"}
• Badge ID: ${captain.badgeId || "N/A"}
• Badge Count: ${captain.badgeCnt || "N/A"}
• Title: ${captain.title || "N/A"}
• Release Version: ${captain.releaseVersion || "N/A"}
• Created At: ${formatDate(captain.createAt)}
• Last Login: ${formatDate(captain.lastLoginAt)}

📝 Bio:
${social.signature || "—"}

━━━━━━━━━━━━━━━
📡 Siam Bhau`;

    
    api.sendMessage(msg, event.threadID, async (err, info) => {
      if (err) return;

      
      const imgUrl = `OUTFIT-API`;
      const path = __dirname + `/outfit_${uid}.png`;
      const file = fs.createWriteStream(path);

      https.get(imgUrl, response => {
        response.pipe(file);
        file.on("finish", () => {
          file.close(() => {
            api.sendMessage({
              body: "🧥 𝗣𝗹𝗮𝘆𝗲𝗿 𝗢𝘂𝘁𝗳𝗶𝘁:",
              attachment: fs.createReadStream(path)
            }, event.threadID, () => {
              fs.unlinkSync(path); 
            }, info.messageID);
          });
        });
      }).on("error", err => {
        console.log("Outfit Image Error:", err.message);
        fs.unlinkSync(path);
      });
    });

  } catch (err) {
    console.log(err.message);
    return api.sendMessage("❌ সার্ভার থেকে তথ্য আনতে সমস্যা হয়েছে।", event.threadID, event.messageID);
  }
};
