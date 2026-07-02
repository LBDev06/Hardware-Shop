import { Attachment } from "../../enterprise/entities/attachment";

export interface AttachmentRepository {
  create(attachment: Attachment): Promise<Attachment>;
  findById(id: string): Promise<Attachment | null>;
}
