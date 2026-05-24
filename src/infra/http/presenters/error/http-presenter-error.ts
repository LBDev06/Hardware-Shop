import { FastifyReply } from "fastify";
import { UserAlreadyExistsError } from "@/core/errors/user-already-exists-error";

export class HttpErrorPresenter {
  static toHTTP(error: unknown, reply: FastifyReply) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    return reply.status(400).send({ message: "Unexpected error" });
  }
}
