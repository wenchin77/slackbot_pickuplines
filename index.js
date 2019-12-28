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
    '安安我是 applepie，你今天被撩了嗎？ 還沒的話趕快輸入 @applepie！不然你打 "inspire me" 可以看看業界名言',
    params
  );
});

// Error Handler
bot.on("error", err => console.log(err));

// Message Handler
bot.on("message", data => {
  console.log(data);
  if (data.subtype) {
    // bot reply to itself >> shut down
    return;
  };
  if (data.type == "desktop_notification") {
    throwPickUpLine();
    return;
  } else if (data.type !== "message") {
    return;
  } else {
    console.log("Handling message...");
    handleMessage(data.text);
    console.log(data.text);
  }
});

function throwPickUpLine() {
  bot.postMessageToChannel;
  let replyData = fs.readFileSync("content/pickuplines.json");
  let content = JSON.parse(replyData);

  // random reply
  const no = Math.floor(Math.random() * content.length);
  const question = content[no].question;
  const reply = content[no].reply;

  // let params = { icon_emoji: ":smirk:" };

  // if there's a question, wait for a user to type something before sending out the reply
  if (question) {
    bot.postMessageToChannel(channel, question, params);
    if (bot.on("message")) {
      bot.postMessageToChannel(channel, reply, params);
    }
    return;
  }

  // if it's only one sentence
  bot.postMessageToChannel(channel, reply, params);
}

// Respons to Data
function handleMessage(message) {
  if (message.includes("ethan")) {
    hailMyEthan();
  } else if (message.includes("inspire me")) {
    inspireMe();
  } else if (message.includes("applepie")) {
    throwPickUpLine();
  } else if (message.includes("help")) {
    runHelp();
  }
}

function hailMyEthan() {
  bot.postMessageToChannel;
  let replyData = fs.readFileSync("content/content.json");
  console.log(replyData);
  let replies = JSON.parse(replyData);
  console.log(replies);
  // random reply
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
