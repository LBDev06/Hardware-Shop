import { FastifyInstance } from "fastify";
import { uploadAttachmentController } from "../controller/upload-attachment-controller";
import { loginRequired } from "../middleware/login-required";
import { verifyJwt } from "../middleware/verify-jwt";

export function attachmentRoutes(app: FastifyInstance) {
  app.post(
    "/attachments",
    { onRequest: [verifyJwt, loginRequired] },
    uploadAttachmentController,
  );
}
