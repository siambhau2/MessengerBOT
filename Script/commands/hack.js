module.exports.config = {
  'name': "hack",
  'version': "1.0.0",
  'hasPermssion': 0x0,
  'credits': "Bhau",
  'description': "hack",
  'commandCategory': "hack",
  'usages': "@mention",
  'dependencies': {
    'axios': '',
    'fs-extra': ''
  },
  'cooldowns': 0x0
};
module.exports.wrapText = (_0xd7edfc, _0x3cbc8a, _0x25fb06) => {
  return new Promise(_0x449397 => {
    if (_0xd7edfc.measureText(_0x3cbc8a).width < _0x25fb06) {
      return _0x449397([_0x3cbc8a]);
    }
    if (_0xd7edfc.measureText('W').width > _0x25fb06) {
      return _0x449397(null);
    }
    const _0x5bcb47 = _0x3cbc8a.split(" ");
    const _0x317999 = [];
    let _0x292a58 = '';
    while (_0x5bcb47.length > 0) {
      let _0x123d3d = false;
      while (_0xd7edfc.measureText(_0x5bcb47[0]).width >= _0x25fb06) {
        const _0x5674cf = _0x5bcb47[0];
        _0x5bcb47[0] = _0x5674cf.slice(0, -1);
        if (_0x123d3d) {
          _0x5bcb47[1] = '' + _0x5674cf.slice(-1) + _0x5bcb47[1];
        } else {
          _0x123d3d = true;
          _0x5bcb47.splice(1, 0, _0x5674cf.slice(-1));
        }
      }
      if (_0xd7edfc.measureText('' + _0x292a58 + _0x5bcb47[0]).width < _0x25fb06) {
        _0x292a58 += _0x5bcb47.shift() + " ";
      } else {
        _0x317999.push(_0x292a58.trim());
        _0x292a58 = '';
      }
      if (_0x5bcb47.length === 0) {
        _0x317999.push(_0x292a58.trim());
      }
    }
    return _0x449397(_0x317999);
  });
};
module.exports.run = async function ({
  args: _0x3be024,
  Users: _0x2518b9,
  Threads: _0x2f6ba6,
  api: _0x42f783,
  event: _0xdbba42,
  Currencies: _0x10d15e
}) {
  const {
    loadImage: _0x529a97,
    createCanvas: _0x366621
  } = require("canvas");
  const _0x16d843 = global.nodemodule["fs-extra"];
  const _0x3aab96 = global.nodemodule.axios;
  let _0x495b14 = __dirname + "/cache/background.png";
  let _0x29f95b = __dirname + "/cache/Avtmot.png";
  var _0x584819 = Object.keys(_0xdbba42.mentions)[0] || _0xdbba42.senderID;
  var _0x2a5dee = await _0x2518b9.getNameUser(_0x584819);
  var _0x2ede29 = ["https://i.imgur.com/1Wys9u7.jpeg"];
  var _0x4a3597 = _0x2ede29[Math.floor(Math.random() * _0x2ede29.length)];
  let _0x3f9218 = (await _0x3aab96.get("https://graph.facebook.com/" + _0x584819 + "/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662", {
    'responseType': "arraybuffer"
  })).data;
  _0x16d843.writeFileSync(_0x29f95b, Buffer.from(_0x3f9218, "utf-8"));
  let _0x2d19b1 = (await _0x3aab96.get('' + _0x4a3597, {
    'responseType': "arraybuffer"
  })).data;
  _0x16d843.writeFileSync(_0x495b14, Buffer.from(_0x2d19b1, "utf-8"));
  let _0x338961 = await _0x529a97(_0x495b14);
  let _0xbdda51 = await _0x529a97(_0x29f95b);
  let _0x50ac2d = _0x366621(_0x338961.width, _0x338961.height);
  let _0x4128d1 = _0x50ac2d.getContext('2d');
  _0x4128d1.drawImage(_0x338961, 0, 0, _0x50ac2d.width, _0x50ac2d.height);
  _0x4128d1.font = "400 23px Arial";
  _0x4128d1.fillStyle = "#1878F3";
  _0x4128d1.textAlign = "start";
  const _0xf246da = await this.wrapText(_0x4128d1, _0x2a5dee, 1160);
  _0x4128d1.fillText(_0xf246da.join("\n"), 200, 497);
  _0x4128d1.beginPath();
  _0x4128d1.drawImage(_0xbdda51, 83, 437, 100, 101);
  const _0x24aac1 = _0x50ac2d.toBuffer();
  _0x16d843.writeFileSync(_0x495b14, _0x24aac1);
  _0x16d843.removeSync(_0x29f95b);
  return _0x42f783.sendMessage({
    'body': " ",
    'attachment': _0x16d843.createReadStream(_0x495b14)
  }, _0xdbba42.threadID, () => _0x16d843.unlinkSync(_0x495b14), _0xdbba42.messageID);
};
