import { CreateQuestionUseCase } from "@/domain/marketplace/app/use-cases/create-question";
import { PrismaProductRespository } from "@/infra/db/repo/prisma-product-repository";
import { PrismaQuestionRepository } from "@/infra/db/repo/prisma-question-repository";

export function makeCreateQuestionUseCase(){
    const questionRepository = new PrismaQuestionRepository()
    const productRepoository = new PrismaProductRespository()

    const createQuestionUseCase = new CreateQuestionUseCase(questionRepository, productRepoository)
    return createQuestionUseCase
}