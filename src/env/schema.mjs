// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXTAUTH_SECRET:
    process.env.NODE_ENV === "production"
      ? z.string().min(1)
      : z.string().min(1).optional(),
  NEXTAUTH_URL: z.preprocess(
    // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
    // Since NextAuth.js automatically uses the VERCEL_URL if present.
    (str) => process.env.VERCEL_URL ?? str,
    // VERCEL_URL doesn't include `https` so it cant be validated as a URL
    process.env.VERCEL ? z.string() : z.string().url(),
  ),
  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
  SUBSCRIBESTAR_CLIENT_ID: z.string(),
  SUBSCRIBESTAR_CLIENT_SECRET: z.string(),
  PATREON_CLIENT_ID: z.string(),
  PATREON_CLIENT_SECRET: z.string(),
  GUMROAD_CLIENT_ID: z.string(),
  GUMROAD_CLIENT_SECRET: z.string(),
  GUMROAD_ACCESS_TOKEN: z.string(),
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  CLOUDFLARE_IMAGES_TOKEN: z.string(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  NEXT_PUBLIC_SUBSCRIBESTAR_CLIENT_ID: z.string(),
  NEXT_PUBLIC_PATREON_CLIENT_ID: z.string(),
  NEXT_PUBLIC_GUMROAD_CLIENT_ID: z.string(),
  NEXT_PUBLIC_CLOUDFLARE_IMAGEHASH: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
  NEXT_PUBLIC_SUBSCRIBESTAR_CLIENT_ID: process.env.NEXT_PUBLIC_SUBSCRIBESTAR_CLIENT_ID,
  NEXT_PUBLIC_PATREON_CLIENT_ID: process.env.NEXT_PUBLIC_PATREON_CLIENT_ID,
  NEXT_PUBLIC_GUMROAD_CLIENT_ID: process.env.NEXT_PUBLIC_GUMROAD_CLIENT_ID,
  NEXT_PUBLIC_CLOUDFLARE_IMAGEHASH: process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGEHASH,
};
