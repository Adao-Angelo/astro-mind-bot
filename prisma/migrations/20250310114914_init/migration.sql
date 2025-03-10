-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "channelId" TEXT NOT NULL,
    "guildId" TEXT,
    "createdTimestamp" BIGINT NOT NULL,
    "type" INTEGER NOT NULL,
    "system" BOOLEAN NOT NULL,
    "content" TEXT,
    "authorId" TEXT NOT NULL,
    "authorUsername" TEXT NOT NULL,
    "authorGlobalName" TEXT,
    "authorDiscriminator" TEXT NOT NULL,
    "authorAvatar" TEXT,
    "authorBot" BOOLEAN NOT NULL,
    "authorSystem" BOOLEAN NOT NULL,
    "pinned" BOOLEAN NOT NULL,
    "tts" BOOLEAN NOT NULL,
    "nonce" TEXT,
    "editedTimestamp" BIGINT,
    "webhookId" TEXT,
    "applicationId" TEXT,
    "activity" TEXT,
    "flags" INTEGER NOT NULL
);
INSERT INTO "new_Message" ("activity", "applicationId", "authorAvatar", "authorBot", "authorDiscriminator", "authorGlobalName", "authorId", "authorSystem", "authorUsername", "channelId", "content", "createdTimestamp", "editedTimestamp", "flags", "guildId", "id", "nonce", "pinned", "system", "tts", "type", "webhookId") SELECT "activity", "applicationId", "authorAvatar", "authorBot", "authorDiscriminator", "authorGlobalName", "authorId", "authorSystem", "authorUsername", "channelId", "content", "createdTimestamp", "editedTimestamp", "flags", "guildId", "id", "nonce", "pinned", "system", "tts", "type", "webhookId" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
