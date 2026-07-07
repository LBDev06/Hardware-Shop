import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeModifyUserRoleUseCase } from "../factories/make-modify-user-role-use-case";
import { HttpErrorPresenter } from "../presenters/error/http-error-presenter";

export async function changeUserRoleController(req: FastifyRequest, reply: FastifyReply) {
  const idSchema = z.string().uuid()

  const changeUserRoleSchema = z.object({
    role: z.string(),
  });
   
  const id = idSchema.parse(req.userId)
  const { role } = changeUserRoleSchema.parse(req.body);

  try {
    const modifyyUserRoleUseCase = makeModifyUserRoleUseCase();

    const result = await modifyyUserRoleUseCase.execute({
      userId: id,
      role,
    });

    if (result.isLeft()) {
      return HttpErrorPresenter.toHTTP(result.value, reply);
    }

    return reply.status(200).send({ message: "Change role successfuly" });
  } catch (error) {
    return reply.status(500).send({ message: `${error}` });
  }
}
