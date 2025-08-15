module.exports.config = {
 name: "info",
 version: "1.2.6",
 hasPermssion: 0,
 credits: "Siam Bhau",
 description: "info bot owner",
 commandCategory: "For users",
 hide:true,
 usages: "",
 cooldowns: 5,
};

module.exports.run = async function ({ api, event, args, Users, Threads }) {
 const { threadID } = event;
 const { configPath } = global.client;
 const { ADMINBOT } = global.config;
 const { NDH } = global.config;
 const { commands } = global.client;
 const fs = global.nodemodule["fs-extra"];
 const moment = require("moment-timezone");

 delete require.cache[require.resolve(configPath)];
 const config = require(configPath);
 const PREFIX = config.PREFIX;
 const namebot = config.BOTNAME;

 const threadSetting = (await Threads.getData(String(threadID))).data || {};
 const prefix = threadSetting.hasOwnProperty("PREFIX") ? threadSetting.PREFIX : PREFIX;

 const time = process.uptime(),
       hours = Math.floor(time / (60 * 60)),
       minutes = Math.floor((time % (60 * 60)) / 60),
       seconds = Math.floor(time % 60);

 const totalUsers = global.data.allUserID.length;
 const totalThreads = global.data.allThreadID.length;

 const msg = 
`🍀----আসসালামু আলাইকুম----🍀

┏━━•❅•••❈•••❈•••❅•━━┓
「 ${namebot} 」
┗━━•❅•••❈•••❈•••❅•━━┛ 

━━━━━━━━━━━━━━━━━━━━━━

🛠️ [ ROBOT SYSTEM INFO ]
» Prefix system: ${PREFIX}
» Prefix box: ${prefix}
» Total Modules: ${commands.size}
» Active Time: ${hours}h ${minutes}m ${seconds}s
» Ping: ${Date.now() - event.timestamp}ms

━━━━━━━━━━━━━━━━━━━━━━

👤 [ ROBOT OWNER INFO ]
» Name : Siam Bhau
» Facebook: https://www.facebook.com/SiamBhau69
» Telegram: t.me/SiamBhau

━━━━━━━━━━━━━━━━━━━━━━

📊 [ TOTAL STATS ]
» Total Users: ${totalUsers}
» Total Groups: ${totalThreads}

━━━━━━━━━━━━━━━━━━━━━━

❤️ Thanks for using Bhau BOT!`;

 return api.sendMessage(msg, threadID);
}
