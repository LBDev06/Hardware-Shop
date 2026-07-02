import { AttachmentRepository } from "@/domain/marketplace/app/repo/attachment-repository";
import { Attachment } from "@/domain/marketplace/enterprise/entities/attachment";

export class InMemoryAttachmentRepository implements AttachmentRepository {
  public items: Attachment[] = [];

  async create(attachment: Attachment): Promise<Attachment> {
    this.items.push(attachment);
    return attachment;
  }

  async findById(id: string): Promise<Attachment | null> {
    const attachment = this.items.find((item) => item.id.toString() === id);
    return attachment ?? null;
  }
}
