import bot from "../lib/bot";
const { google } = require("googleapis");
const spreadsheetID = "1ttD1tC1MO1Ab_mRl6roKoG5zx9-9VW4URZbQfMV7etw";

if (process.env.NODE_ENV == "production") {
  var fs = require("fs");

  fs.writeFile(
    "../../secrets.json",
    process.env.SECRET,
    (err: any) => {
      err;
    },
  );
}

async function main(key: string, ctx: any) {
  const auth = new google.auth.GoogleAuth({
    keyFile: "secrets.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({ version: "v4", auth: client });

  const metaData = await googleSheets.spreadsheets.get({
    auth: auth,
    includeGridData: true,
    spreadsheetId: spreadsheetID,
  });

  var getRows = await googleSheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: spreadsheetID,
    range: "Sheet1!A3:Z1004",
  });
  //   console.log(getRows);

  getRows = Object.assign(
    // @ts-ignore
    ...getRows.data.values.map(([key, val]) => ({ [key]: val })),
  );
  console.log("resolve");
  console.log(getRows[key]);
  ctx.reply(getRows[key]);

  return getRows[key];
}

const safety = () => {
  try {
    bot.on("text", (ctx) => {
      main(ctx.update.message.text, ctx);
    });
  } catch (error) {
    console.log(error);
  }
};

export default safety;
