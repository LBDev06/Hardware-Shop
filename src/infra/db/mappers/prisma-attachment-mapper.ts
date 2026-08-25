import { UniqueEntityId } from "@/core/unique-entity-id";
import { Attachment } from "@/domain/marketplace/enterprise/entities/attachment";
import { Attachment as PrismaAttachment } from "generated/prisma";

export class PrismaAttachmentMapper {
  static toDomain(raw: PrismaAttachment): Attachment {
    return Attachment.create(
      {
        link: raw.link,
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(attachment: Attachment) {
    return {
      id: attachment.id.toString(),
      link: attachment.link,
      createdAt: attachment.createdAt,
    };
  }
}
