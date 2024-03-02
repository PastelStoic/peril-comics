import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import {
  checkPatreonStatus,
  checkSubscribestarStatus,
} from "../externals/userpayments";

import { type Context } from "./context";

// configure this externally
const supporterPaymentMin = 300;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;

/**
 * Unprotected procedure
 */
export const publicProcedure = t.procedure;

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
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
 */
export const protectedProcedure = t.procedure.use(isAuthed);
export const adminOnlyProcedure = t.procedure.use(isAuthed).use(
  ({ ctx, next }) => {
    if (ctx.session.user.role !== "admin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only site administrators are permitted to do that.",
      });
    }
    return next();
  },
);
