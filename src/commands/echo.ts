import { Markup } from "telegraf";

import bot from "../lib/bot";

const echo = () => {
  try {
    bot.on("message", (ctx) =>
      ctx.telegram.sendCopy(ctx.message.chat.id, ctx.message),
    );
  } catch (error) {
    console.log(error);
  }
  bot.action("delete", (ctx) => ctx.deleteMessage());
};

export default echo;
