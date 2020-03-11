const SlackBot = require("slackbots");
const axios = require("axios");
const fs = require("fs");
const puppeteer = require("puppeteer");

const dotenv = require("dotenv");
dotenv.config();

const bot = new SlackBot({
  token: process.env.BOT_TOKEN,
  name: "applepie"
});

const channel = "happy";

const params = {
  icon_emoji: ":apple:"
};

// Start Handler
bot.on("start", () => {
  bot.postMessageToChannel(
    channel,
    '安安我是 applepie，你今天被撩了嗎？Tag 我讓你一秒臉紅心跳！除了被撩，如果你想查東西可以打 "search"（例如 "Hey, search corona virus"），不然打 "inspire me" 也可以看看科技業名言。快來玩我吧！',
    params
  );
});

// Exit
bot.on("close", () => {
  bot.postMessageToChannel(chanenl, "走了掰掰", params);
});

// Error Handler
bot.on("error", err => console.log(err));

// Message Handler
bot.on("message", data => {
  console.log("on message", data);

  // 讓他不要跟自己講話
  if (data.subtype == "bot_message") {
    return;
  }

  // 提到他就丟撩妹話
  if (data.type == "desktop_notification" && !qid) {
    throwPickUpLine();
    return;
  }

  // 監聽大家的訊息
  if (data.type == "message") {
    console.log("Handling message...");
    handleMessage(data.text);
  }
});

const replyData = fs.readFileSync("content/pickuplines.json");
const content = JSON.parse(replyData);
let qid = null;

function throwPickUpLine() {
  const randomNo = Math.floor(Math.random() * content.length);
  const question = content[randomNo].question;
  const reply = content[randomNo].reply;
  if (question) {
    qid = randomNo;
    bot.postMessageToChannel(channel, question, params);
    return;
  }
  // if it's only one sentence
  bot.postMessageToChannel(channel, reply, params);
}

function throwPickUpReply(num) {
  const reply = content[num].reply;
  bot.postMessageToChannel(channel, reply, params);
}

// Respons to Data
function handleMessage(message) {
  // 承接上面的問題
  if (qid) {
    throwPickUpReply(qid);
    qid = null;
    return;
  }
  
  if (message.includes("inspire me")) {
    inspireMe();
    return;
  }
  if (message.includes("help")) {
    runHelp();
    return;
  }
  if (message.includes("search")) {
    showWikiContent(message.split('search')[1]);
  }
}


async function showWikiContent(message) {
  let keyword = message.split(" ")[1];
  if (message.split(" ").length > 2) {
    for (let i = 2; i < message.split(" ").length; i++) {
      keyword += `_${message.split(" ")[i]}`;
    }
  }
  try{
    const wikiLink = `https://en.m.wikipedia.org/wiki/${keyword}`
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(wikiLink);
    let content = await page.evaluate(() => {
      let results = '';
      let items = document.querySelectorAll(".mf-section-0 > p");
      for (i=0;i<2;i++) {
        if (items[i] !== "\n" && items[i].innerText !== undefined){
          results += `${items[i].innerText}\n\n`;
        }
      }
      return results;
    });
    await browser.close();
    bot.postMessageToChannel(channel, `${content} See more at ${wikiLink}`, params);
  } catch(err) {
    console.log(err);
    bot.postMessageToChannel(channel, `Sorry, I don't understand. Ask me something else?`, params);
  } 
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
    'Tag 我讓你一秒臉紅心跳！除了被撩，如果你想查東西可以打 "search"（例如 "Hey, search corona virus"），不然打 "inspire me" 也可以看看科技業名言。快來玩我吧！',
    params
  );
}
