import { checkPatreonStatus, checkSubscribestarStatus } from "src/server/externals/userpayments";
import { z } from "zod";
import { setRoleToGuest } from 'dbschema/queries';
import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  validateSubscribestarSupporter: protectedProcedure
  .query(async ({ ctx }) => {
    try {
      return await checkSubscribestarStatus(ctx.session.user.id, ctx.edgedb);
    } catch (error) {
      console.log("error", error);
    }
  }),

  validatePatreonSupporter: protectedProcedure
  .query(async ({ ctx }) => {
    try {
      return await checkPatreonStatus(ctx.session.user.id, ctx.edgedb);
    } catch (error) {
      console.log("error", error);
    }
  }),
  
  checkGuestCode: protectedProcedure
  .input(z.object({
    code: z.string(),
  }))
  .mutation(async ({ctx, input}) => {
    try {
      if (input.code === "XTPLC") {
        await setRoleToGuest(ctx.edgedb, {id: ctx.session.user.id})
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }),
})
;