import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeChangeUserEmailUseCase } from "../factories/make-change-user-email-use-case";
import { HttpErrorPresenter } from "../presenters/error/http-error-presenter";
import { UserPresenter } from "../presenters/user-presenter";

export async function changeUserEmailController(
  req: FastifyRequest,
  reply: FastifyReply,
) {

  const idSchema = z.string().uuid()

  const changeUserEmailSchema = z.object({
    password: z.string().min(6),
    newEmail: z.string().email(),
  });
   
  const id = idSchema.parse(req.userId)
  const { password, newEmail } = changeUserEmailSchema.parse(req.body);

  try {
    const changeUserEmailUseCase = makeChangeUserEmailUseCase();

    const result = await changeUserEmailUseCase.execute({
      userId: id,
      password,
      newEmail,
    });

    if (result.isLeft()) {
      return HttpErrorPresenter.toHTTP(result.value, reply);
    }

    return reply.status(201).send({
      user: UserPresenter.toHTTP(result.value.user),
    });
  } catch (error) {
    return reply.status(500).send({ message: `${error}` });
  }
}
