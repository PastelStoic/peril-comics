import { z } from "zod";
import {
  createComic,
  getAllComics,
  getComicByTitle,
  searchComics,
  updateComic,
} from "dbschema/queries";
import { adminOnlyProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  checkGumroadStatus,
  checkPatreonStatus,
  checkSubscribestarStatus,
} from "../../externals/userpayments";

const supporterPaymentMin = 300;

export const comicRouter = router({
  search: publicProcedure
    .input(z.object({
      title: z.string().nullish(),
      page: z.number().min(1).nullish(),
    }))
    .query(async ({ ctx, input }) => {
      try {
        const includeHidden = ctx.session?.user?.role === "admin";
        if (!input.title || input.title.length === 0) {
          return await getAllComics(ctx.edgedb, { includeHidden });
        }
        const result = await searchComics(ctx.edgedb, {
          searchText: input.title,
          includeHidden,
          page: input.page,
        });
        return result;
      } catch (error) {
        console.log("error", error);
      }
    }),

  getByTitle: publicProcedure
    .input(z.object({
      title: z.string().min(1),
    }))
    .query(async ({ ctx, input }) => {
      const result = await getComicByTitle(ctx.edgedb, input);
      // if comic is not public and there is no authed user, tell them to sign in
      if (!result?.is_free) {
        if (!ctx.session?.user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: `To view this content, follow these steps:
          1. Log in using your discord account (see above)
          2. In the account page, link either your patreon or subscribestar account.
          3. If you haven't already, support us on either site.
          4. Enjoy the comics!`,
          });
        } else {
          // if they're not an admin or guest, check if they're a supporter
          if (
            ctx.session.user.role !== "admin" &&
            ctx.session.user.role !== "guest"
          ) {
            const supporterData = await Promise.all([
              checkSubscribestarStatus(ctx.session.user.id, ctx.edgedb),
            ]);
            if (
              !supporterData.some((data) =>
                data.supportAmount != null &&
                data.supportAmount >= supporterPaymentMin
              )
            ) {
              let errorMessage;
              // if any support exists, tell the user they don't have enough
              // otherwise tell them they aren't currently a supporter
              if (supporterData.some((data) => data.supportAmount != null)) {
                errorMessage = `You must be a supporter at $${
                  Math.round(
                    Math.max(
                      ...supporterData.map((d) => d.supportAmount ?? 0),
                    ) /
                      100,
                  )
                }}.00 or above to view this content. Your current support level is $${
                  Math.round(
                    supporterPaymentMin /
                      100,
                  )
                }.00. Your role is ${ctx.session.user.role}`;
              } else {
                errorMessage = "You aren't currently a supporter.";
              }
              throw new TRPCError({
                code: "UNAUTHORIZED",
                message: errorMessage,
              });
            }
          }
        }
      }

      if (result) return result;
      throw new TRPCError({
        message: `No comic "${input.title}" could be found.`,
        code: "NOT_FOUND",
      });
    }),

  createComic: adminOnlyProcedure
    .input(z.object({
      title: z.string(),
      description: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await createComic(ctx.edgedb, input);
      } catch (error) {
        console.log(error);
      }
    }),

  updateComic: adminOnlyProcedure
    .input(z.object({
      id: z.string().min(10),
      title: z.string().min(3),
      description: z.string().min(3),
      private: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await updateComic(ctx.edgedb, input);
      } catch (error) {
        console.log(error);
      }
    }),
});
