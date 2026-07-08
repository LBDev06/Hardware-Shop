import { EditAnswerQuestionUseCase } from "@/domain/marketplace/app/use-cases/edit-answer-question";
import { PrismaAnswerRepository } from "@/infra/db/repo/prisma-answer-repository";

export function makeEditAnswerQuestionUseCase(){
    const answersQuestionsRepository = new PrismaAnswerRepository()
    const editAnswerQuestionUseCase = new EditAnswerQuestionUseCase(answersQuestionsRepository)

    return editAnswerQuestionUseCase
}