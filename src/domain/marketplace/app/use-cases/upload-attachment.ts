import { right } from "@/core/either";
import { AttachmentRepository } from "../repo/attachment-repository";
import { Attachment } from "@/domain/marketplace/enterprise/entities/attachment";
import { Uploader } from "../storage/uploader";

interface UploadAttachmentUseCaseRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
}

type UploadAttachmentUseCaseResponse = {
  attachment: Attachment;
};

export class UploadAttachmentUseCase {
  constructor(
    private uploader: Uploader,
    private attachmentRepository: AttachmentRepository,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAttachmentUseCaseRequest) {
    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    });

    const attachment = Attachment.create({
      link: url,
    });

    const createdAttachment = await this.attachmentRepository.create(attachment);

    return right<never, UploadAttachmentUseCaseResponse>({
      attachment: createdAttachment,
    });
  }
}
