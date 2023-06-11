import { initTRPC, TRPCError } from "@trpc/server";
import { env } from "src/env/server.mjs";
import superjson from "superjson";
import { checkPatreonStatus, checkSubscribestarStatus } from "../externals/userpayments";

import { type Context } from "./context";

// configure this externally
const supporterPaymentMin = 1500;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user || env.NODE_ENV !== "development") {
    throw new TRPCError({ 
      code: "UNAUTHORIZED",
      message: "You must be logged in to do that.",
    });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Protected procedure
 **/
export const protectedProcedure = t.procedure.use(isAuthed);
export const adminOnlyProcedure = t.procedure.use(isAuthed).use(({ctx, next}) => {
  if (ctx.session.user.role !== "admin") {
    throw new TRPCError({ 
      code: "UNAUTHORIZED",
      message: "Only site administrators are permitted to do that.",
    });
  }
  return next();
})

/**
 * Ensures that the user is either an admin, guest, or 15$ supporter.
 */
export const supporterOnlyProcedure = t.procedure.use(isAuthed).use(async ({ ctx, next }) => {
  if (ctx.session.user.role === "admin" || ctx.session.user.role === "guest") {
    return next();
  }

  const supporterData = await Promise.all([
    checkPatreonStatus(ctx.session.user.id, ctx.edgedb), 
    checkSubscribestarStatus(ctx.session.user.id, ctx.edgedb)
  ]);
  
  if (!supporterData.some(data => data.supportAmount >= supporterPaymentMin)) {
    throw new TRPCError({ 
      code: "UNAUTHORIZED",
      message: `You must be a supporter at $15.00 or above to view this content. Your current support level is $${Math.round(Math.max(...supporterData.map(d => d.supportAmount)) / 100)}.00. Your role is ${ctx.session.user.role}`
    });
  }

  return next();
});