import { CreateQuestionUseCase } from "@/domain/marketplace/app/use-cases/create-question";
import { PrismaProductRepository } from "@/infra/db/repo/prisma-product-repository";
import { PrismaQuestionRepository } from "@/infra/db/repo/prisma-question-repository";

export function makeCreateQuestionUseCase(){
    const questionRepository = new PrismaQuestionRepository()
    const productRepository = new PrismaProductRepository()

    const createQuestionUseCase = new CreateQuestionUseCase(questionRepository, productRepository)
    return createQuestionUseCase
}