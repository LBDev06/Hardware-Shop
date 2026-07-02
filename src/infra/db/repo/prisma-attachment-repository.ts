import { AttachmentRepository } from "@/domain/marketplace/app/repo/attachment-repository";
import { Attachment } from "@/domain/marketplace/enterprise/entities/attachment";
import { db } from "../libs/prisma";
import { PrismaAttachmentMapper } from "../mappers/prisma-attachment-mapper";

export class PrismaAttachmentRepository implements AttachmentRepository {
  async create(attachment: Attachment): Promise<Attachment> {
    const createdAttachment = await db.attachment.create({
      data: PrismaAttachmentMapper.toPrisma(attachment),
    });

    return PrismaAttachmentMapper.toDomain(createdAttachment);
  }

  async findById(id: string): Promise<Attachment | null> {
    const attachment = await db.attachment.findUnique({
      where: { id },
    });

    if (!attachment) {
      return null;
    }

    return PrismaAttachmentMapper.toDomain(attachment);
  }
}
