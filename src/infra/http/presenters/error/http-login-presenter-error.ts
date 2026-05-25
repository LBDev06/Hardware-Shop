import { FastifyReply } from "fastify";
import { InvalidCredentialError } from "@/core/errors/invalid-credential-error";

export class HttpLoginErrorPresenter {
  static toHTTP(error: unknown, reply: FastifyReply) {
    if (error instanceof InvalidCredentialError) {
      return reply.status(401).send({ message: error.message });
    }

    return reply.status(400).send({ message: "Unexpected error" });
  }
}
