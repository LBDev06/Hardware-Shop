import { FastifyReply, FastifyRequest } from "fastify";
import { makeUploadAttachmentUseCase } from "../factories/make-upload-attachment-use-case";
import { AttachmentPresenter } from "../presenters/attachment-presenter";

const ACCEPTED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function uploadAttachmentController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const file = await req.file();

    if (!file) {
      return reply.status(400).send({
        message: "File is required.",
      });
    }

    if (!ACCEPTED_MIME_TYPES.has(file.mimetype)) {
      return reply.status(400).send({
        message: "Invalid file type.",
      });
    }

    const buffer = await file.toBuffer();
    const uploadAttachmentUseCase = makeUploadAttachmentUseCase();
    const result = await uploadAttachmentUseCase.execute({
      fileName: file.filename,
      fileType: file.mimetype,
      body: buffer,
    });

    return reply.status(201).send({
      attachment: AttachmentPresenter.toHTTP(result.value.attachment),
    });
  } catch (error) {
    return reply.status(500).send({
      message: `${error}`,
    });
  }
}
