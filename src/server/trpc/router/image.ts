import { z } from "zod";
import { env } from "src/env/server.mjs";
import { router, adminOnlyProcedure } from "../trpc";
import axios from "axios";
import * as queries from "dbschema/queries";

type CloudflareImageResult = {
  result?: {
    id: string,
    uploadURL: string,
  },
  result_info: unknown,
  success: boolean,
}

export const imageRouter = router({
  getUploadUrl: adminOnlyProcedure
  .mutation(async ({}) => {
    try {
      const uploadUrl = await axios.post(`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`, null, {
        headers: {
          "Authorization": `Bearer ${env.CLOUDFLARE_IMAGES_TOKEN}`
        }
      });
      return uploadUrl.data as CloudflareImageResult;
    } catch (error) {
      console.log("error", error);
    }
  }),

  uploadImage: adminOnlyProcedure
  .input(z.object({
    id: z.string().min(10),
    name: z.string(),
  }))
  .mutation(async ({ctx, input}) => {
    try {
      const result = await queries.createCloudflareImage(ctx.edgedb, input);
      return result?.id;
    } catch (error) {
      console.log(error);
      return null;
    }
  }),

  deleteImage: adminOnlyProcedure
  .input(z.object({
    id: z.string().min(10),
  }))
  .mutation(async ({ctx, input}) => {
    try {
      // this needs to return the id of the cloudflare image so I can delete it
      await queries.deleteComicImage(ctx.edgedb, input);
    } catch (error) {
      console.log("error", error);
    }
  }),

  addImageToComic: adminOnlyProcedure
  .input(z.object({
    comicId: z.string().min(10),
    imageId: z.string(),
    page: z.number(),
  }))
  .mutation(async ({ctx, input}) => {
    try {
      await queries.addImageToComic(ctx.edgedb, input);
    } catch (error) {
      console.log("error", error);
    }
  }),

  modifyImage: adminOnlyProcedure
  .input(z.object({
    id: z.string(),
    name: z.string(),
    layer: z.number().min(0),
    startPage: z.number().min(1),
    endPage: z.number().min(1),
    tags: z.array(z.string()),
  }))
  .mutation(async ({ctx, input}) => {
    try {
      await queries.updateComicImage(ctx.edgedb, input);
    } catch (error) {
      console.log(error);
    }
  }),
  
  getUnassignedImages: adminOnlyProcedure
  .input(z.object({
    text: z.string().nullish(),
  }))
  .query(async ({ctx, input}) => {
    try {
      return await queries.searchUnassignedImages(ctx.edgedb, input);
    } catch (error) {
      console.log(error);
    }
  }),
});