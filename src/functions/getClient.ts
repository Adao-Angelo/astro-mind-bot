import { Client, IntentsBitField } from "discord.js";

const discordClient = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

export function getDiscordClient() {
  return discordClient;
}
