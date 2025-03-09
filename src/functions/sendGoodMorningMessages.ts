import { schedule } from "node-cron";
import { getDiscordClient } from "./getClient";

import { TextChannel } from "discord.js";

export async function sendGoodMorningMessages() {
  const discordClient = getDiscordClient();

  const channel = discordClient.channels.cache.get("1273005921760706660");

  if (channel && channel instanceof TextChannel) {
    console.log("Sending good morning messages");
    await channel.send("Good morning! 🌞");
  }
}

export function scheduleMessageAtTime(time: string) {
  console.log(`Scheduling message at ${time}`);

  const [hour, minute] = time.split(":").map(Number);

  const cronExpression = `${minute} ${hour} * * *`;

  schedule(cronExpression, sendGoodMorningMessages);
}

scheduleMessageAtTime("21:54");
