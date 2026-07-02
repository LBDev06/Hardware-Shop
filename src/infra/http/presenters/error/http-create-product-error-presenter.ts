import { FastifyReply } from "fastify";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { SameOldCredentialsError } from "@/core/errors/same-old-credentials-error";
import { UserNotAllowedError } from "@/core/errors/user-not-allowed-error";

export class HttpCreateProductErrorPresenter {
  static toHTTP(error: unknown, reply: FastifyReply) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    if (error instanceof UserNotAllowedError) {
      return reply.status(403).send({ message: error.message });
    }

    if (error instanceof SameOldCredentialsError) {
      return reply.status(400).send({ message: error.message });
    }

    return reply.status(400).send({ message: "Unexpected error" });
  }
}
