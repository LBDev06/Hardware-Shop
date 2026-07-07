import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeChangeUserPasswordUseCase } from "../factories/make-change-user-password-use-case";
import { HttpErrorPresenter } from "../presenters/error/http-error-presenter";

export async function changeUserPasswordController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const idSchema = z.string().uuid()

  const changeUserPasswordBodySchema = z.object({
    oldPassword: z.string().min(6),
    newPassword: z.string().min(6),
  });
  
  const id = idSchema.parse(req.userId)
  const { oldPassword, newPassword } = changeUserPasswordBodySchema.parse(
    req.body,
  );

  try {
    const changeUserPasswordUseCase = makeChangeUserPasswordUseCase();

    const result = await changeUserPasswordUseCase.execute({
      userId: id,
      oldPassword,
      newPassword,
    });

    if (result.isLeft()) {
      return HttpErrorPresenter.toHTTP(result.value, reply);
    }
    return reply.status(200).send({ message: "Password change successfully" });
  } catch (error) {
    return reply.status(500).send({ message: `${error}` });
  }
}
