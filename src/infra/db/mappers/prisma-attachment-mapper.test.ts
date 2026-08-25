import { describe, expect, it } from "vitest";
import { PrismaAttachmentMapper } from "./prisma-attachment-mapper";
import { Attachment } from "@/domain/marketplace/enterprise/entities/attachment";
import { UniqueEntityId } from "@/core/unique-entity-id";

describe("PrismaAttachmentMapper", () => {
  it("should map domain Attachment to Prisma Attachment object", () => {
    const attachment = Attachment.create(
      {
        link: "https://example.com/image.png",
        createdAt: new Date("2026-08-20T10:00:00Z"),
      },
      new UniqueEntityId("attachment-1")
    );

    const prismaAttachment = PrismaAttachmentMapper.toPrisma(attachment);

    expect(prismaAttachment).toEqual({
      id: "attachment-1",
      link: "https://example.com/image.png",
      createdAt: new Date("2026-08-20T10:00:00Z"),
    });
  });

  it("should map raw Prisma Attachment to domain Attachment entity", () => {
    const raw = {
      id: "attachment-1",
      link: "https://example.com/image.png",
      createdAt: new Date("2026-08-15T18:00:00Z"),
    };

    const attachment = PrismaAttachmentMapper.toDomain(raw);

    expect(attachment.id.toString()).toBe("attachment-1");
    expect(attachment.link).toBe("https://example.com/image.png");
    expect(attachment.createdAt).toEqual(new Date("2026-08-15T18:00:00Z"));
  });
});
