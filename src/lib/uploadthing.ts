import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getAuthUser } from "./auth";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
    .middleware(async () => {
      const auth = await getAuthUser();
      if (!auth) throw new Error("Tizimga kirish kerak");
      return { userId: auth.userId };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
