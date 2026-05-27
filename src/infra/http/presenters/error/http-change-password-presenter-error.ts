import { FastifyReply } from "fastify";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { InvalidCredentialError } from "@/core/errors/invalid-credential-error";
import { SameOldCredentialsError } from "@/core/errors/same-old-credentials-error";

export class HttpChangePasswordErrorPresenter {
  static toHTTP(error: unknown, reply: FastifyReply) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    if (error instanceof InvalidCredentialError) {
      return reply.status(401).send({ message: error.message });
    }

    if (error instanceof SameOldCredentialsError) {
      return reply.status(400).send({ message: error.message });
    }

    return reply.status(400).send({ message: "Unexpected error" });
  }
}
