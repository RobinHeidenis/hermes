import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "~/server/db";
import { sessions } from "~/server/db/schema/sessions";
import { Lucia } from "lucia";
import { env } from "~/env.mjs";
import { Discord } from "arctic";
import { users } from "~/server/db/schema";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const discord = new Discord(
  process.env.DISCORD_CLIENT_ID!,
  process.env.DISCORD_CLIENT_SECRET!,
  `http://localhost:3000/api/login/discord/callback`,
);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      discordId: attributes.discord_id,
      name: attributes.name,
      email: attributes.email,
      image: attributes.image,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  discord_id: number;
  name: string;
  email: string;
  image: string;
}
