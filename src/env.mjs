// @ts-check
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    /**
     * Specify your server-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars.
     */
    server: {
        DATABASE_URL: z
            .string()
            .url()
            .refine(
                (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
                "You forgot to change the default URL"
            ),
        DISCORD_CLIENT_ID: z.string().min(1),
        DISCORD_CLIENT_SECRET: z.string().min(1),
        VERCEL_URL: z.string(),
        NODE_ENV: z
            .enum(["development", "test", "production"])
            .default("development"),
    },

    /**
     * Specify your client-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars. To expose them to the client, prefix them with
     * `NEXT_PUBLIC_`.
     */
    client: {
        NEXT_PUBLIC_SPECIAL_USER_IDS: z.string().optional().transform(string => string?.split(',') ?? []),
        NEXT_PUBLIC_SPECIAL_CARD_NUMBER: z.string(),
    },

    /**
     * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
     * middlewares) or client-side so we need to destruct manually.
     */
    runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
        DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
        DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
        VERCEL_URL: process.env.VERCEL_URL ?? 'localhost:3000',
        NODE_ENV: process.env.NODE_ENV,

        NEXT_PUBLIC_SPECIAL_USER_IDS: process.env.NEXT_PUBLIC_SPECIAL_USER_IDS,
        NEXT_PUBLIC_SPECIAL_CARD_NUMBER: process.env.NEXT_PUBLIC_SPECIAL_CARD_NUMBER,
    },
    /**
     * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
     * useful for Docker builds.
     */
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
