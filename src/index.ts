import { Message } from "typegram";
import { Telegraf } from "telegraf";

import config from "./config";

import bot from "./lib/bot";
import helper from "./commands/helper";
import safety from "./commands/safety";

import { toEscapeMsg } from "./utils/messageHandler";

//Production Settings
if (process.env.NODE_ENV === "production") {
  //Production Logging
  bot.use((ctx, next) => {
    if (ctx.message && config.LOG_GROUPID) {
      let userInfo: string;
      if (ctx.message.from.username) {
        userInfo = `name: [${toEscapeMsg(
          ctx.message.from.first_name,
        )}](tg://user?id=${ctx.message.from.id}) \\(@${toEscapeMsg(
          ctx.message.from.username,
        )}\\)`;
      } else {
        userInfo = `name: [${toEscapeMsg(
          ctx.message.from.first_name,
        )}](tg://user?id=${ctx.message.from.id})`;
      }
      const text = `\ntext: ${
        (ctx.message as Message.TextMessage).text
      }`;
      const logMessage = userInfo + toEscapeMsg(text);
      bot.telegram.sendMessage(config.LOG_GROUPID, logMessage, {
        parse_mode: "MarkdownV2",
      });
    }
    return next();
  });
  bot.launch({
    webhook: {
      domain: config.URL,
      port: Number(config.PORT),
    },
  });
} else {
  //Development logging
  bot.use(Telegraf.log());
  bot.launch();
}

safety();
