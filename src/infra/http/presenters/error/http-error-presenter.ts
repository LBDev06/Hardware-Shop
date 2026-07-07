import { FastifyReply } from "fastify";
import { errorStatusMap } from "@/core/errors/erros-status-map";

export class HttpErrorPresenter {
  static toHTTP(error: unknown, reply: FastifyReply) {
    if (error instanceof Error) {
      const statusCode = errorStatusMap.get(error.constructor);

      if (statusCode) {
        return reply.status(statusCode).send({
          message: error.message,
        });
      }
    }

    return reply.status(500).send({
      message: "Internal server error",
    });
  }
}
