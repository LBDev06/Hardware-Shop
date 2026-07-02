import { UploadAttachmentUseCase } from "@/domain/marketplace/app/use-cases/upload-attachment";
import { PrismaAttachmentRepository } from "@/infra/db/repo/prisma-attachment-repository";
import { CloudinaryUploader } from "@/infra/storage/cloudinary-uploader";

export function makeUploadAttachmentUseCase() {
  const uploader = new CloudinaryUploader();
  const attachmentRepository = new PrismaAttachmentRepository();

  return new UploadAttachmentUseCase(uploader, attachmentRepository);
}
