import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import { makeGetUserProfileUseCase } from "../factories/make-get-user-profile-use-case";
import { UserPresenter } from "../presenters/user-presenter";

export async function profile(req: FastifyRequest, reply: FastifyReply) {
  await req.jwtVerify();

  const getUserProfile = makeGetUserProfileUseCase();
  try {
    const result = await getUserProfile.execute({
      id: req.user.sub,
    });

    if (result.isLeft()) {
      return;
    }

    return reply.status(201).send({
      user: UserPresenter.toHTTP(result.value.user),
    });
  } catch {
    return reply.status(500);
  }
}
