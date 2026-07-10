import { DeleteAnswerQuestionUseCase } from "@/domain/marketplace/app/use-cases/delete-answer-question";
import { PrismaAnswerRepository } from "@/infra/db/repo/prisma-answer-repository";

export function makeDeleteAnswerQuestionUseCase(){
    const answersRepository = new PrismaAnswerRepository()
    const deleteAnswerQuestionUseCase = new DeleteAnswerQuestionUseCase(answersRepository)

    return deleteAnswerQuestionUseCase
}