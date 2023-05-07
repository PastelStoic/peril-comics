import { z } from "zod";
import { getComicByTitle, getAllComics, updateComic, createComic, searchComics } from 'dbschema/queries';
import { router, publicProcedure, supporterOnlyProcedure, adminOnlyProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const comicRouter = router({
  search: publicProcedure
  .input(z.object({
    title: z.string().nullish(),
    page: z.number().min(1).nullish(),
  }))
  .query(async ({ctx, input}) => {
    try {
      const includeHidden = ctx.session?.user?.role === "admin";
      if (!input.title || input.title.length === 0) return await getAllComics(ctx.edgedb, { includeHidden });
      const result = await searchComics(ctx.edgedb, { searchText: input.title, includeHidden, page: input.page });
      return result;
    } catch (error) {
      console.log("error", error);
    }
  }),

  getByTitle: supporterOnlyProcedure
  .input(z.object({
    title: z.string().min(1),
  }))
  .query(async ({ctx, input}) => {
    const result = await getComicByTitle(ctx.edgedb, input);
    if (result) return result;
    throw new TRPCError({message: "No comic could be found by that name.", code: "NOT_FOUND"});
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