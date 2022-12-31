import { z } from "zod";
import { getComicByTitle, getAllComics, updateComic, createComic, searchComics } from 'dbschema/queries';
import { router, publicProcedure, supporterOnlyProcedure, adminOnlyProcedure } from "../trpc";

export const comicRouter = router({
  search: publicProcedure
  .input(z.object({
    title: z.string().nullish(),
  }))
  .query(async ({ctx, input}) => {
    try {
      const includeHidden = ctx.session?.user?.role === "admin";
      if (!input.title || input.title.length === 0) return await getAllComics(ctx.edgedb, { includeHidden });
      return await searchComics(ctx.edgedb, { searchText: input.title, includeHidden });
    } catch (error) {
      console.log("error", error);
    }
  }),

  getByTitle: supporterOnlyProcedure
  .input(z.object({
    title: z.string().min(1),
  }))
  .query(async ({ctx, input}) => {
    try {
      return await getComicByTitle(ctx.edgedb, input);
    } catch (error) {
      console.log("error", error);
    }
  }),

  createComic: adminOnlyProcedure
  .input(z.object({
    title: z.string(),
    description: z.string(),
  }))
  .mutation(async ({ctx, input}) => {
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
  .mutation(async ({ctx, input}) => {
    try {
      return await updateComic(ctx.edgedb, input);
    } catch (error) {
      console.log(error);
    }
  }),
});