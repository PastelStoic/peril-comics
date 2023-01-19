
export type CloudflareUploadResult = {
  errors: Array<unknown>,
  messages: Array<string>,
  result?: {
    metadata: Record<string, unknown>,
    filename: string,
    id: string,
    requireSignedURLs: boolean,
    uploaded: string,
    variants: Array<string>,
  },
  success: boolean,
}