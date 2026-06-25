import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeLoginUserUseCase } from "../factories/make-login-user-use-case";
import { HttpLoginErrorPresenter } from "../presenters/error/http-login-presenter-error";

export async function loginUserController(req: FastifyRequest, reply: FastifyReply) {
  const loginUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = loginUserSchema.parse(req.body);

  try {
    const loginUseCase = makeLoginUserUseCase();

    const result = await loginUseCase.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      return HttpLoginErrorPresenter.toHTTP(result.value, reply);
    }

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: result.value.user.id.toString(),
        },
      },
    );
    return reply.status(200).send({
      token,
    });
  } catch (error) {
    return reply.status(500).send({
      message: `${error}`,
    });
  }
}
