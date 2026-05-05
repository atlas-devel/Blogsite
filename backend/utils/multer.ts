import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blogsite",
    allowed_formats: ["jpg", "jpeg", "png"],
  } as any,
});

export const upload = multer({ storage });
