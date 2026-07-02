import { v2 as cloudinary } from "cloudinary";

import {
  Uploader,
  UploadParams,
  UploadResult,
} from "@/domain/marketplace/app/storage/uploader";
import { env } from "@/infra/http/env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export class CloudinaryUploader implements Uploader {
  async upload({ body, fileName, fileType }: UploadParams): Promise<UploadResult> {
    const fileAsBase64 = body.toString("base64");
    const fileUri = `data:${fileType};base64,${fileAsBase64}`;

    const response = await cloudinary.uploader.upload(fileUri, {
      filename_override: fileName,
      resource_type: "auto",
      folder: "hardware-shop",
    });

    return {
      url: response.secure_url,
    };
  }
}
