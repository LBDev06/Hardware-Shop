import { CreateAnswerQuestionUseCase } from "@/domain/marketplace/app/use-cases/create-answer-question"
import { PrismaAnswerRepository } from "@/infra/db/repo/prisma-answer-repository"
import { PrismaProductRespository } from "@/infra/db/repo/prisma-product-repository"
import { PrismaQuestionRepository } from "@/infra/db/repo/prisma-question-repository"

export function makeCreateAnswerQuestionUseCase(){
    const productsRepository = new PrismaProductRespository()
    const questionsRepository = new PrismaQuestionRepository()
    const answersRepository = new PrismaAnswerRepository()
    const createAnswerQuestionUseCase = new CreateAnswerQuestionUseCase(productsRepository,questionsRepository, answersRepository)

    return createAnswerQuestionUseCase
}