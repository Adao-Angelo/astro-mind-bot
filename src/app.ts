import { Client, IntentsBitField } from "discord.js";
import { config } from "dotenv";

config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`The bot ${client.user?.tag} is online!`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  console.log(`${message.author.tag}: ${message.content}`);

  if (message.content === "!ping") {
    message.reply("Pong! 🏓");
  }
});

client.login(process.env.DISCORD_TOKEN);
