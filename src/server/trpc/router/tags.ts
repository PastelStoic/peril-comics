import { z } from "zod";
import { searchTags } from 'dbschema/queries';
import { router, publicProcedure } from "../trpc";

export const tagRouter = router({
  search: publicProcedure
  .input(z.object({
    name: z.string().nullable(),
  }))
  .query(async ({ctx, input}) => {
    try {
      return await searchTags(ctx.edgedb, input);
    } catch (error) {
      console.log("error", error);
    }
  }),
})
;