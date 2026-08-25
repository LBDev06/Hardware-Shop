import { FastifyInstance } from "fastify";
import { uploadAttachmentController } from "../controller/upload-attachment-controller";
import { loginRequired } from "../middleware/login-required";
import { verifyJwt } from "../middleware/verify-jwt";

export function attachmentRoutes(app: FastifyInstance) {
  app.post(
    "/attachments",
    {
      onRequest: [verifyJwt, loginRequired],
      schema: {
        tags: ["Attachments"],
        summary: "Upload de imagem/anexo",
        description:
          "Realiza o upload de arquivos de imagem (JPEG, PNG, WEBP) para o armazenamento em nuvem (Cloudinary) e retorna o link e ID do anexo para associação a produtos.",
        security: [{ bearerAuth: [] }],
        consumes: ["multipart/form-data"],
        response: {
          201: {
            description: "Upload realizado com sucesso",
            type: "object",
            properties: {
              attachment: {
                type: "object",
                properties: {
                  id: { type: "string", format: "uuid", example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" },
                  link: { type: "string", format: "uri", example: "https://res.cloudinary.com/.../image.png" },
                },
              },
            },
          },
          400: {
            description: "Arquivo obrigatório ou formato inválido",
            type: "object",
            properties: {
              message: { type: "string", example: "Invalid file type." },
            },
          },
          401: { description: "Não autorizado", type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    uploadAttachmentController,
  );
}

