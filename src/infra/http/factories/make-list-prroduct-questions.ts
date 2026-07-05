import { ListProductQuestionsUseCase } from "@/domain/marketplace/app/use-cases/list-product-questions";
import { PrismaProductRespository } from "@/infra/db/repo/prisma-product-repository";
import { PrismaQuestionRepository } from "@/infra/db/repo/prisma-question-repository";

export function makeListProductQuestionsCreateUseCase(){
    const productsRepository = new PrismaProductRespository()
    const questionsRepositorry = new PrismaQuestionRepository()

    const listProductQuestionsUseCase = new ListProductQuestionsUseCase(productsRepository, questionsRepositorry)
    return listProductQuestionsUseCase
}