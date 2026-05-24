import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeRegisterUserUseCase } from "../factories/make-register-user-use-case";
import { UserPresenter } from "@/presenters/user-presenter";
import { HttpErrorPresenter } from "@/presenters/error/http-presenter-error";

export async function registerUser(req: FastifyRequest, reply: FastifyReply) {
  const registerUserSchema = z.object({
    name: z.string().max(50),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerUserSchema.parse(req.body);
  try {
    const registerUseCase = makeRegisterUserUseCase();

    const result = await registerUseCase.execute({
      name,
      email,
      password,
    });

    if (result.isRight()) {
      return reply.status(201).send({
        user: UserPresenter.toHTTP(result.value.user),
      });
    }

    if (result.isLeft()) {
      return HttpErrorPresenter.toHTTP(result.value, reply);
    }
  } catch (error) {
    return reply.status(500).send({
      message: "Internal server erro",
    });
  }
}
