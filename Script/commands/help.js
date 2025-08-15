module.exports.config = {
    name: "help",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "Siam Bhau",
    description: "FREE SET-UP MESSENGER",
    commandCategory: "system",
    usages: "[Name module]",
    cooldowns: 5,
    envConfig: {
        autoUnsend: true,
        delayUnsend: 20
    }
};

module.exports.languages = {
 "en": {
    "moduleInfo": "╭──────•◈•──────╮\n |        Bhau BOT\n |●𝗡𝗮𝗺𝗲: •—» %1 «—•\n |●𝗨𝘀𝗮𝗴𝗲: %3\n |●𝗗𝗲𝘀𝗰𝗿𝗶p𝘁𝗶𝗼𝗻: %2\n |●𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: %4\n |●𝗪𝗮𝗶𝘁𝗶𝗻𝗴 𝘁𝗶𝗺𝗲: %5 seconds(s)\n |●𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻: %6\n |𝗠𝗼𝗱𝘂𝗹𝗲 𝗰𝗼𝗱𝗲 𝗯𝘆\n |•—» Siam Bhau «—•\n╰──────•◈•──────╯",
    "helpList": '[ There are %1 commands on this bot, Use: "%2help nameCommand" to know how to use! ]',
    "user": "User",
    "adminGroup": "Admin group",
    "adminBot": "Admin bot"
  }
};

module.exports.handleEvent = function ({ api, event, getText }) {
 const { commands } = global.client;
 const { threadID, messageID, body } = event;

 if (!body || typeof body == "undefined" || body.indexOf("help") != 0) return;
 const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
 if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase()])) return;
 const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
 const command = commands.get(splitBody[1].toLowerCase());
 const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
 return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits), threadID, messageID);
}

module.exports.run = function({ api, event, args, getText }) {
 const { commands } = global.client;
 const { threadID, messageID } = event;
 const command = commands.get((args[0] || "").toLowerCase());
 const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
 const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

 if (args[0] == "all") {
    const command = commands.values();
    var group = [], msg = "";
    for (const commandConfig of command) {
      if (!group.some(item => item.group.toLowerCase() == commandConfig.config.commandCategory.toLowerCase())) 
        group.push({ group: commandConfig.config.commandCategory.toLowerCase(), cmds: [commandConfig.config.name] });
      else 
        group.find(item => item.group.toLowerCase() == commandConfig.config.commandCategory.toLowerCase()).cmds.push(commandConfig.config.name);
    }
    group.forEach(commandGroup => msg += `❄️ ${commandGroup.group.charAt(0).toUpperCase() + commandGroup.group.slice(1)} \n${commandGroup.cmds.join(' • ')}\n\n`);

    return api.sendMessage(`✿🄲🄾🄼🄼🄰🄽🄳 🄻🄸🅂🅃✿\n\n${msg}✿══════════════✿\n│𝗨𝘀𝗲 ${prefix}help [Name?]\n│𝗨𝘀𝗲 ${prefix}help [Page?]\n│𝗡𝗔𝗠𝗘 𝗢𝗪𝗡𝗘𝗥 : │Siam Bhau\n│𝗧𝗢𝗧𝗔𝗟 :  ${commands.size}\n————————————`, threadID, messageID);
 }

 if (!command) {
    const arrayInfo = [];
    const page = parseInt(args[0]) || 1;
    const numberOfOnePage = 15;
    let i = 0;
    let msg = "";

    for (var [name, value] of (commands)) {
      name += ``;
      arrayInfo.push(name);
    }

    arrayInfo.sort((a, b) => a.data - b.data);  
    const first = numberOfOnePage * page - numberOfOnePage;
    i = first;
    const helpView = arrayInfo.slice(first, first + numberOfOnePage);

    for (let cmds of helpView) msg += `•—»[ ${cmds} ]«—•\n`;

    const siu = `╭──────•◈•──────╮\n |        Bhau BOT\n |   🄲🄾🄼🄼🄰🄽🄳 🄻🄸🅂🅃       \n╰──────•◈•──────╯`;
    const text = `╭──────•◈•──────╮\n│𝗨𝘀𝗲 ${prefix}help [Name?]\n│𝗨𝘀𝗲 ${prefix}help [Page?]\n│𝗡𝗔𝗠𝗘 𝗢𝗪𝗡𝗘𝗥 : │ Siam Bhau\n│𝗧𝗢𝗧𝗔𝗟 : [${arrayInfo.length}]\n│📛🄿🄰🄶🄴📛 :  [${page}/${Math.ceil(arrayInfo.length/numberOfOnePage)}]\n╰──────•◈•──────╯`;

    return api.sendMessage(siu + "\n\n" + msg + text, threadID, messageID);
 }

 const leiamname = getText("moduleInfo", command.config.name, command.config.description, `${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits);

 return api.sendMessage(leiamname, threadID, messageID);
};
