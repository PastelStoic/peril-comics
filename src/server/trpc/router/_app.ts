import { publicProcedure, router } from "../trpc";
import { comicRouter } from "./comic";
import { imageRouter } from "./image";
import { tagRouter } from "./tags";
import { userRouter } from "./user";

export const appRouter = router({
  comics: comicRouter,
  users: userRouter,
  images: imageRouter,
  tags: tagRouter,
  example: publicProcedure.query(async ({ctx}) => {
    return await ctx.edgedb.querySingle<string>("select 'Hello, world!'");
  })
});

// export type definition of API
export type AppRouter = typeof appRouter;