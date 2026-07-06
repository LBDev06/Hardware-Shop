import { DeleteQuestionUseCase } from "@/domain/marketplace/app/use-cases/delete-question";
import { PrismaQuestionRepository } from "@/infra/db/repo/prisma-question-repository";

export function makeDeleteQuestionUseCase(){
    const questionsRepository = new PrismaQuestionRepository()
    const deleteQuestionUseCase = new DeleteQuestionUseCase(questionsRepository)

    return deleteQuestionUseCase
}