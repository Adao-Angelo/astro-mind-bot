import { config } from "dotenv";
import { ai } from "./ai";
import { getDiscordClient } from "./functions/getClient";
import "./functions/sendGoodMorningMessages";

const discordClient = getDiscordClient();

config();

discordClient.on("ready", () => {
  console.log(`${discordClient.user?.tag} is online!`);
});

discordClient.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  console.log(`${message.author.tag}: ${message.content}`);

  const response = await ai(message.content, message.author.tag);

  message.reply(response);
});

discordClient.login(process.env.DISCORD_TOKEN);
