import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeChangeUserEmailUseCase } from "../factories/make-change-user-email-use-case";
import { HttpChangeEmailErrorPresenter } from "../presenters/error/http-change-email-presenter-error";
import { UserPresenter } from "../presenters/user-presenter";

export async function changeUserEmail(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const changeUserEmailParamsSchema = z.object({
    id: z.string().uuid(),
  });

  const changeUserEmailSchema = z.object({
    password: z.string().min(6),
    newEmail: z.string().email(),
  });

  const { id } = changeUserEmailParamsSchema.parse(req.params);
  const { password, newEmail } = changeUserEmailSchema.parse(req.body);

  try {
    const changeUserEmailUseCase = makeChangeUserEmailUseCase();

    const result = await changeUserEmailUseCase.execute({
      userId: id,
      password,
      newEmail,
    });

    if (result.isLeft()) {
      return HttpChangeEmailErrorPresenter.toHTTP(result.value, reply);
    }

    return reply.status(201).send({
      user: UserPresenter.toHTTP(result.value.user),
    });
  } catch (error) {
    return reply.status(500).send({ message: `${error}` });
  }
}
