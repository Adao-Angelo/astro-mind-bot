import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { ai, resumer } from "./ai";
import { getDiscordClient } from "./functions/getClient";
import "./functions/sendGoodMorningMessages";

config();

const discordClient = getDiscordClient();
const prisma = new PrismaClient();

discordClient.on("ready", () => {
  console.log(`${discordClient.user?.tag} is online!`);
});

discordClient.on("messageUpdate", async (oldMessage, newMessage) => {
  if (newMessage.author.bot) return;

  console.log(`${newMessage.author.tag}: ${newMessage.content}`);

  try {
    await prisma.message.update({
      where: {
        id: oldMessage.id,
      },
      data: {
        content: newMessage.content || null,
        editedTimestamp: newMessage.editedTimestamp
          ? BigInt(newMessage.editedTimestamp)
          : null,
      },
    });
  } catch (error) {
    console.error("Error updating message in the bank:", error);
  }

  if (newMessage.content.toLocaleLowerCase().includes("astro")) {
    const response = await ai(
      JSON.stringify(newMessage),
      newMessage.author.tag
    );
    newMessage.reply(response);
  }
});

discordClient.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  console.log(`${message.author.tag}: ${message.content}`);

  if (message.content.includes("generate resume")) {
    const messages = await prisma.message.findMany({
      where: {
        guildId: message.guildId,
      },
      orderBy: {
        createdTimestamp: "asc",
      },
    });

    const messagesString = JSON.stringify(messages, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    const resume = await resumer(messagesString);

    message.reply(resume);

    return;
  }

  try {
    await prisma.message.create({
      data: {
        id: message.id,
        channelId: message.channelId,
        guildId: message.guildId,
        createdTimestamp: BigInt(message.createdTimestamp),
        type: message.type,
        system: message.system,
        content: message.content || null,
        authorId: message.author.id,
        authorUsername: message.author.username,
        authorGlobalName: message.author.globalName || null,
        authorDiscriminator: message.author.discriminator,
        authorAvatar: message.author.avatar || null,
        authorBot: message.author.bot,
        authorSystem: message.author.system,
        pinned: message.pinned,
        tts: message.tts,
        nonce: message.nonce as string,
        editedTimestamp: message.editedTimestamp
          ? BigInt(message.editedTimestamp)
          : null,
        webhookId: message.webhookId || null,
        applicationId: message.applicationId || null,
        activity: message.activity ? JSON.stringify(message.activity) : null,
        flags: message.flags.bitfield,
      },
    });
  } catch (error) {
    console.error("Error saving message to the bank:", error);
  }

  if (message.content.toLocaleLowerCase().includes("astro")) {
    const response = await ai(JSON.stringify(message), message.author.tag);
    message.reply(response);
  }
});

discordClient.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith("delete messages")) {
    const args = message.content.split(" ");
    const userId = args[2];

    if (!userId) {
      try {
        const messages = await message.channel.messages.fetch({ limit: 100 });
        const botMessages = messages.filter(
          (msg) => msg.author.id === discordClient.user?.id
        );

        if (botMessages.size === 0) {
          return message.reply("❌ No messages found from the bot.");
        }

        await Promise.all(botMessages.map((msg) => msg.delete()));

        message.channel.send("✅ Bot's messages have been deleted!");
      } catch (error) {
        console.error("Error while deleting bot's messages:", error);
        message.channel.send("❌ Error while deleting bot's messages.");
      }
    } else {
      try {
        const messages = await message.channel.messages.fetch({ limit: 100 });
        const userMessages = messages.filter((msg) => msg.author.id === userId);

        if (userMessages.size === 0) {
          return message.reply("❌ No messages found from this user.");
        }

        await Promise.all(userMessages.map((msg) => msg.delete()));

        message.channel.send(
          `✅ All messages from <@${userId}> have been deleted!`
        );
      } catch (error) {
        console.error("Error while deleting user's messages:", error);
        message.channel.send("❌ Error while deleting user's messages.");
      }
    }
  }
});

discordClient.login(process.env.DISCORD_TOKEN);
