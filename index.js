// use npm slackbots
const SlackBot = require("slackbots");
const axios = require("axios");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();


const bot = new SlackBot({
  token: process.env.BOT_TOKEN,
  name: "applepie"
});

const channel = "bot-test";

const params = {
  icon_emoji: ":apple:"
};

// Start Handler
bot.on("start", () => {
  bot.postMessageToChannel(
    channel,
    '安安我是 applepie，你今天被撩了嗎？輸入 @applepie 讓你臉紅心跳！不然打 "inspire me" 可以看看業界名言',
    params
  );
});

// Exit
bot.on('close', () => {
  bot.postMessageToChannel(chanenl, '走了掰掰', params)
})

// Error Handler
bot.on("error", err => console.log(err));

// Message Handler
bot.on("message", data => {
  console.log(data);

  // bot reply to itself: shut down
  if (data.subtype == "bot_message") {
    return;
  }

  if (data.type == "desktop_notification" && !qid) {
    throwPickUpLine();
    return;
  }

  if (data.type !== "message") {
    return;
  }

  // data.type == "message"
  console.log("Handling message...");
  handleMessage(data.text);
});

const replyData = fs.readFileSync("content/pickuplines.json");
const content = JSON.parse(replyData);
let qid;

function throwPickUpLine() {
  // random reply
  const randomNo = Math.floor(Math.random() * content.length);
  const question = content[randomNo].question;
  const reply = content[randomNo].reply;
  if (question) {
    qid = randomNo;
    bot.postMessageToChannel(channel, question, params);
    console.log(randomNo);
    return;
  }

  // if it's only one sentence
  bot.postMessageToChannel(channel, reply, params);
}


function throwPickUpReply(num) {
  // reply to the question asked earlier
  const reply = content[num].reply;
  // let params = { icon_emoji: ":smirk:" };
  bot.postMessageToChannel(channel, reply, params);
}



// Respons to Data
function handleMessage(message) {
  
  // show answer with qid and clear qid for the next question to show
  if(qid) {
      throwPickUpReply(qid);
      qid = null;
  }

  if (message.includes("ethan")) {
    hailMyEthan();
    return;
  };
  if (message.includes("inspire me")) {
    inspireMe();
    return;
  };
  if (message.includes("help")) {
    runHelp();
    return;
  }
}

function hailMyEthan() {
  bot.postMessageToChannel;
  let replyData = fs.readFileSync("content/content.json");
  console.log(replyData);
  let replies = JSON.parse(replyData);
  console.log(replies);
  const no = Math.floor(Math.random() * replies.length);
  const reply = replies[no].reply;
  console.log(reply);
  bot.postMessageToChannel(channel, reply, params);
}

// inspire Me
function inspireMe() {
  axios
    .get(
      "https://raw.githubusercontent.com/BolajiAyodeji/inspireNuggets/master/src/quotes.json"
    )
    .then(res => {
      const quotes = res.data;
      const random = Math.floor(Math.random() * quotes.length);
      const quote = quotes[random].quote;
      const author = quotes[random].author;

      bot.postMessageToChannel(channel, `:zap: ${quote} - *${author}*`, params);
    });
}

// Show Help Text
function runHelp() {
  const params = {
    icon_emoji: ":question:"
  };

  bot.postMessageToChannel(
    channel,
    '欠撩就打 @applepie 跟我聊聊，想看業界名言就打 "inspire me"',
    params
  );
}
