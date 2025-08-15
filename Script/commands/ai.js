const axios = require("axios");
module.exports = {
  'config': {
    'name': 'ai',
    'version': "1.0",
    'credit': "—͟͟͞͞𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
    'description': "gemeini ai",
    'cooldowns': 0x5,
    'hasPermssion': 0x0,
    'commandCategory': "google",
    'usages': {
      'en': "{pn} message | photo reply"
    }
  },
  'run': async ({
    api: _0x514d79,
    args: _0x57f99e,
    event: _0x2521fc
  }) => {
    const _0x19c761 = _0x57f99e.join(" ");
    if (_0x2521fc.type === "message_reply") {
      var _0x4d49f7 = _0x2521fc.messageReply.attachments[0].url;
      try {
        const _0x3f9592 = await axios.post("https://geminipro-3rhs.onrender.com/chat-with-gemini", {
          'modelType': "text_and_image",
          'prompt': _0x19c761 || '',
          'imageParts': [_0x4d49f7]
        });
        const _0x41c9cd = _0x3f9592.data.result;
        _0x514d79.sendMessage(_0x41c9cd, _0x2521fc.threadID, _0x2521fc.messageID);
      } catch (_0x122064) {
        console.error("Error:", _0x122064.message);
        _0x514d79.sendMessage(_0x122064, _0x2521fc.threadID, _0x2521fc.messageID);
      }
    } else {
      if (!_0x19c761) {
        return _0x514d79.sendMessage("Assalamu Alaikum\n\n\n\nBhau X BOT\nHow  can i assist you today?", _0x2521fc.threadID, _0x2521fc.messageID);
      } else {
        try {
          const _0xff40a3 = await axios.post("https://geminipro-3rhs.onrender.com/chat-with-gemini", {
            'modelType': "text_only",
            'prompt': _0x19c761
          });
          const _0x34bc2a = _0xff40a3.data.result;
          _0x514d79.sendMessage(_0x34bc2a, _0x2521fc.threadID, _0x2521fc.messageID);
        } catch (_0x5e0d59) {
          console.error("Error calling Gemini AI:", _0x5e0d59);
          _0x514d79.sendMessage("Sorry, there was an error processing your request." + _0x5e0d59, _0x2521fc.threadID, _0x2521fc.messageID);
        }
      }
    }
  }
};
