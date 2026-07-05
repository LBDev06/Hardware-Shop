import { FastifyReply } from "fastify";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

export class HttpCreateQuestionErrorPresenter {
  static toHTTP(error: unknown, reply: FastifyReply) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    return reply.status(400).send({ message: "Unexpected error" });
  }
}
