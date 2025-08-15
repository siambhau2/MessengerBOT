module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "1.0.1",
    credits: "Bhau",
    description: "Notification of bots or people entering groups with random gif/photo/video",
    dependencies: {
        "fs-extra": "",
        "path": "",
        "pidusage": ""
    }
};
 
module.exports.run = async function({ api, event }) {
    const { join } = global.nodemodule["path"];
    const { threadID } = event;
    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
        api.changeNickname(`[ ${global.config.PREFIX} ] • ${(!global.config.BOTNAME) ? " " : global.config.BOTNAME}`, threadID, api.getCurrentUserID());
        const fs = require("fs");
        return api.sendMessage("", event.threadID, () => api.sendMessage({
            body: `হেই হোমি! 💫  
আমি *Bhau BOT*, এখন থেকে এই গ্রুপের নতুন সদস্য 🤖  

ধন্যবাদ আমাকে অ্যাড করার জন্য 🌸  
কাজে লাগতে পারলে খুবই খুশি হবো 😇  

লিখো /help — আমি রেডি!  
— তোমাদের নতুন বন্ধু  
Bhau BOT 🧡`,
            attachment: fs.createReadStream(__dirname + "/cache/ullash.mp4")
        }, threadID));
    }
    else {
        try {
            const { createReadStream, existsSync, mkdirSync, readdirSync } = global.nodemodule["fs-extra"];
            let { threadName, participantIDs } = await api.getThreadInfo(threadID);

            const threadData = global.data.threadData.get(parseInt(threadID)) || {};
            const path = join(__dirname, "cache", "joinvideo");
            const pathGif = join(path, `${threadID}.video`);

            var mentions = [], nameArray = [], memLength = [], i = 0;

            for (id in event.logMessageData.addedParticipants) {
                const userName = event.logMessageData.addedParticipants[id].fullName;
                nameArray.push(userName);
                mentions.push({ tag: userName, id });
                memLength.push(participantIDs.length - i++);
            }
            memLength.sort((a, b) => a - b);

            (typeof threadData.customJoin == "undefined") ? msg = `আসসালামু আলাইকুম {name} ভাই/বোন 🌺✨  
আপনাকে {threadName} গ্রুপে স্বাগতম ❤️  

আপনি এই গ্রুপের {soThanhVien} নং সদস্য 🫰  
আশা করি আমাদের সঙ্গে সময়টা উপভোগ করবেন ইনশাআল্লাহ 🤲🌟  
- Bhau BOT 🤖` : msg = threadData.customJoin;

            msg = msg
                .replace(/\{name}/g, nameArray.join(', '))
                .replace(/\{type}/g, (memLength.length > 1) ? 'Friends' : 'Friend')
                .replace(/\{soThanhVien}/g, memLength.join(', '))
                .replace(/\{threadName}/g, threadName);

            if (existsSync(path)) mkdirSync(path, { recursive: true });

            const randomPath = readdirSync(join(__dirname, "cache", "joinGif", "randomgif"));

            if (existsSync(pathGif)) formPush = { body: msg, attachment: createReadStream(pathGif), mentions }
            else if (randomPath.length != 0) {
                const pathRandom = join(__dirname, "cache", "joinGif", "randomgif", `${randomPath[Math.floor(Math.random() * randomPath.length)]}`);
                formPush = { body: msg, attachment: createReadStream(pathRandom), mentions }
            }
            else formPush = { body: msg, mentions }

            return api.sendMessage(formPush, threadID);
        } catch (e) { return console.log(e) };
    }
}
