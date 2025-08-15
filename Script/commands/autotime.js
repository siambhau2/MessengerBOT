module.exports.config = {
  name: "autotime",
  version: "10.02",
  hasPermssion: 0,
  credits: "SiamBhau",
  description: "সেট করা সময় অনুযায়ী স্বয়ংক্রিয়ভাবে বার্তাগুলি পাঠানো হবে!",
  commandCategory: "group messenger",
  usages: '[]',
  cooldowns: 3
};

const nam = [
  { timer: "12:00:00 AM", message: ["🕛 Time Check\nএখন সময় রাত ১২টা।\nরাত ১২টা বাজে! রাত গভীর, কারো চ্যাট চলছে, কারো ঘুম, আর কিছু মানুষ শুধু ভাবনায়...\n~Siam Bhau"] },
  { timer: "1:00:00 AM", message: ["🕐 Time Check\nএখন সময় রাত ১টা।\nচোখ খোলা? মানে ঘুমাস নাই এখনো… ব্রাউজারে ঘুরছিস নাকি? 😏\n~Siam Bhau"] },
  { timer: "2:00:00 AM", message: ["🕑 Time Check\nএখন সময় রাত ২টা।\nপ্রেমিক-প্রেমিকার প্রিয় সময়... আর আমরা? ঘুমে ব্যর্থ একলা সেনা 😔\n~Siam Bhau"] },
  { timer: "3:00:00 AM", message: ["🕒 Time Check\nএখন সময় রাত ৩টা।\nশান্ত রাত, চারপাশ নিরব। একটু মেডিটেশন করো অথবা ঘুমিয়ে পড়ো।\n~Siam Bhau"] },
  { timer: "4:00:00 AM", message: ["🕓 Time Check\nএখন সময় রাত ৪টা।\nকেউ কেউ এখন ফজরের ওয়েট করছে, কেউ এখনো ফোনে 😴📱\n~Siam Bhau"] },
  { timer: "5:00:00 AM", message: ["🕔 Time Check\nএখন সময় ভোর ৫টা।\nসূর্য উঠতে চলেছে! নামাজ পড়ো, ফ্রেশ হও, নতুন দিনের শুরু করো ☀️\n~Siam Bhau"] },
  { timer: "6:00:00 AM", message: ["🕕 Time Check\nএখন সময় সকাল ৬টা।\nঘুম থেকে উঠে একটু হাঁটো, দাত ব্রাশ করো আর একটা deep breath নাও 🍃\n~Siam Bhau"] },
  { timer: "7:00:00 AM", message: ["🕖 Time Check\nএখন সময় সকাল ৭টা।\nস্কুল, কলেজ, অফিস — যার যেখানে যাওয়ার, তৈরি হয়ে নাও! 🚌📚💼\n~Siam Bhau"] },
  { timer: "8:00:00 AM", message: ["🕗 Time Check\nএখন সময় সকাল ৮টা।\nব্রেকফাস্ট টাইম! পেট পূর্ণ হলে মনও ভালো থাকে 😋🍞\n~Siam Bhau"] },
  { timer: "9:00:00 AM", message: ["🕘 Time Check\nএখন সময় সকাল ৯টা।\nমন দিয়ে কাজ করো, পড়াশোনা করো, সময়কে কাজে লাগাও।\n~Siam Bhau"] },
  { timer: "10:00:00 AM", message: ["🕙 Time Check\nএখন সময় সকাল ১০টা।\nমন দিয়ে কাজ করো। distraction নামক দৈত্য থেকে দূরে থাকো 🚫📱\n~Siam Bhau"] },
  { timer: "11:00:00 AM", message: ["🕚 Time Check\nএখন সময় সকাল ১১টা।\nএকটানা কাজ করলে বিরতি নেওয়া দরকার! একটু পানি খাও 💧\n~Siam Bhau"] },
  { timer: "12:00:00 PM", message: ["🕛 Time Check\nএখন সময় দুপুর ১২টা।\nসূর্য মাথার উপর, সময় লাঞ্চের প্রস্তুতির! 🍛\n~Siam Bhau"] },
  { timer: "1:00:00 PM", message: ["🕐 Time Check\nএখন সময় দুপুর ১টা।\nখাবার খেয়ে একটু বিশ্রাম নিতে পারো। রিচার্জ হও 🌤️🛏️\n~Siam Bhau"] },
  { timer: "2:00:00 PM", message: ["🕑 Time Check\nএখন সময় দুপুর ২টা।\nঘুমের ঘোরে চোখ ঢুলে পড়ছে? কিন্তু কাজও করতে হবে! 😪\n~Siam Bhau"] },
  { timer: "3:00:00 PM", message: ["🕒 Time Check\nএখন সময় দুপুর ৩টা।\nএকটু ঘুমানোর ইচ্ছা হতেই পারে... কিন্তু আগে কিছু কাজ সেরে ফেলো ✨\n~Siam Bhau"] },
  { timer: "4:00:00 PM", message: ["🕓 Time Check\nএখন সময় বিকেল ৪টা।\nআসরের নামাজের সময় হয়ে এসেছে। আজান দিলে নামাজ পরে নিও!❤️‍🩹\n~Siam Bhau"] },
  { timer: "5:00:00 PM", message: ["🕔 Time Check\nএখন সময় বিকেল ৫টা।\nএকটু মাঠে যাও, শরীর নড়াও, দিন শেষের আগেই মনটা চাঙা করো 🏃‍♂️⚽\n~Siam Bhau"] },
  { timer: "6:00:00 PM", message: ["🕕 Time Check\nএখন সময় সন্ধ্যা ৬টা।\nআকাশে অন্ধকার নেমেছে, নিজের ও পরিবারের দিকে একটু মন দাও ❤️‍🔥\n~Siam Bhau"] },
  { timer: "7:00:00 PM", message: ["🕖 Time Check\nএখন সময় সন্ধ্যা ৭টা।\nএশার নামাজ পরো, দিনটাকে সুন্দরভাবে শেষ করো।\n~Siam Bhau"] },
  { timer: "8:00:00 PM", message: ["🕗 Time Check\nএখন সময় রাত ৮টা।\nপড়াশোনার সময়। আজকের যা বাকি, একটু দেখে ফেলো 📚✍️\n~Siam Bhau"] },
  { timer: "9:00:00 PM", message: ["🕘 Time Check\nএখন সময় রাত ৯টা।\nখাবার খেয়ে ধীরে ধীরে বিশ্রামের প্রস্তুতি নাও, বিশ্রাম শরীরের জন্য খুব দরকার।\n~Siam Bhau"] },
  { timer: "10:00:00 PM", message: ["🕙 Time Check\nএখন সময় রাত ১০টা।\nঘুমানোর প্রস্তুতি নেও, মনের শান্তির জন্য ১টা সুন্দর Dua পড়ো 💤\n~Siam Bhau"] },
  { timer: "11:00:00 PM", message: ["🕚 Time Check\nএখন সময় রাত ১১টা।\nশেষ রাতের চুপচাপ সময়... Chrome এ কে কে Active আছো জানি 😏📲\n~Siam Bhau"] }
];

// বাংলাদেশ সময় (GMT+6) অনুযায়ী টাইম ম্যানেজমেন্ট
function getBDTimeString() {
  const now = new Date(Date.now() + 6 * 60 * 60 * 1000); // +6 hours
  return now.toLocaleTimeString('en-US', { hour12: true });
}

module.exports.onLoad = ({ api }) => {
  setInterval(() => {
    const currentTime = getBDTimeString();
    const matched = nam.find(e => e.timer === currentTime);
    if (matched) {
      global.data.allThreadID.forEach(threadID => {
        const msg = matched.message[Math.floor(Math.random() * matched.message.length)];
        api.sendMessage(msg, threadID);
      });
    }
  }, 1000);
};

module.exports.run = () => {};
