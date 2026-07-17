import { ListAnswersByProductQuestionsUseCase } from "@/domain/marketplace/app/use-cases/list-answers-by-product-questions";
import { PrismaQuestionRepository } from "@/infra/db/repo/prisma-question-repository";
import { PrismaAnswerRepository } from "@/infra/db/repo/prisma-answer-repository";

export function makeListAnswersByProductQuestionsUseCase(){
    const questionsRepository = new PrismaQuestionRepository()
    const answerQuestionRepository = new PrismaAnswerRepository()

    const listAnswersByProductQuestionsUseCase = new ListAnswersByProductQuestionsUseCase(questionsRepository, answerQuestionRepository)
    return listAnswersByProductQuestionsUseCase
}
