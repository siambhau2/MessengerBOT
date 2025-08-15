module.exports.config = {
  name: "help",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑀_ ☢️",
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
    "moduleInfo":
`╭──────•◈•──────╮
 |        Bhau BOT
 |●𝗡𝗮𝗺𝗲: •—» %1 «—•
 |●𝗨𝘀𝗮𝗴𝗲: %3
 |●𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: %2
 |●𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: %4
 |●𝗪𝗮𝗶𝘁𝗶𝗻𝗴 𝘁𝗶𝗺𝗲: %5 second(s)
 |●𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻: %6
 |𝗠𝗼𝗱𝘂𝗹𝗲 𝗰𝗼𝗱𝗲 𝗯𝘆
 |•—» %7 «—•
╰──────•◈•──────╯`,
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
  if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;

  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const command = commands.get(splitBody[1].toLowerCase());
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

  return api.sendMessage(
    getText("moduleInfo",
      command.config.name,
      command.config.description,
      `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`,
      command.config.commandCategory,
      command.config.cooldowns,
      ((command.config.hasPermssion == 0) ? getText("user") :
       (command.config.hasPermssion == 1) ? getText("adminGroup") :
       getText("adminBot")),
      command.config.credits),
    threadID, messageID);
};

module.exports.run = function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

  if (args[0] == "all") {
    const allCommands = commands.values();
    let group = [], msg = "";

    for (const cmd of allCommands) {
      const category = cmd.config.commandCategory.toLowerCase();
      const name = cmd.config.name;

      if (!group.some(item => item.group === category)) {
        group.push({ group: category, cmds: [name] });
      } else {
        group.find(item => item.group === category).cmds.push(name);
      }
    }

    group.forEach(groupItem => {
      msg += `❄️ ${groupItem.group.charAt(0).toUpperCase() + groupItem.group.slice(1)}\n${groupItem.cmds.join(" • ")}\n\n`;
    });

    const text =
`✿🄲🄾🄼🄼🄰🄽🄳 🄻🄸🅂🅃✿

${msg}✿══════════════✿
│𝗨𝘀𝗲 ${prefix}help [Name?]
│𝗨𝘀𝗲 ${prefix}help [Page?]
│𝗢𝗪𝗡𝗘𝗥 : Siam Bhau
│𝗧𝗢𝗧𝗔𝗟 : ${commands.size}
————————————`;

    return api.sendMessage(text, threadID, messageID);
  }

  if (!command) {
    const arrayInfo = [];
    const page = parseInt(args[0]) || 1;
    const numberOfOnePage = 15;

    for (const [name] of commands) {
      arrayInfo.push(name);
    }

    arrayInfo.sort();
    const start = numberOfOnePage * (page - 1);
    const helpPage = arrayInfo.slice(start, start + numberOfOnePage);

    let msg = helpPage.map(name => `•—»[ ${name} ]«—•`).join("\n");

    const text =
`╭──────•◈•──────╮
 |        Bhau BOT
 |   🄲🄾🄼🄼🄰🄽🄳 🄻🄸🅂🅃
╰──────•◈•──────╯

${msg}
╭──────•◈•──────╮
│𝗨𝘀𝗲 ${prefix}help [Name?]
│𝗨𝘀𝗲 ${prefix}help [Page?]
│𝗢𝗪𝗡𝗘𝗥 : Siam Bhau
│𝗧𝗢𝗧𝗔𝗟 : ${arrayInfo.length}
│📛🄿🄰🄶🄴📛 : [${page}/${Math.ceil(arrayInfo.length / numberOfOnePage)}]
╰──────•◈•──────╯`;

    return api.sendMessage(text, threadID, messageID);
  }

  // Specific command help
  const infoText = getText("moduleInfo",
    command.config.name,
    command.config.description,
    `${(command.config.usages) ? command.config.usages : ""}`,
    command.config.commandCategory,
    command.config.cooldowns,
    ((command.config.hasPermssion == 0) ? getText("user") :
     (command.config.hasPermssion == 1) ? getText("adminGroup") :
     getText("adminBot")),
    command.config.credits);

  return api.sendMessage(infoText, threadID, messageID);
};
