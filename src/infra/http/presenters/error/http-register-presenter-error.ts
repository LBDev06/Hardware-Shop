import { FastifyReply } from "fastify";
import { UserAlreadyExistsError } from "@/core/errors/user-already-exists-error";

export class HttpRegisterErrorPresenter {
  static toHTTP(error: unknown, reply: FastifyReply) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(401).send({ message: error.message });
    }

    return reply.status(400).send({ message: "Unexpected error" });
  }
}
