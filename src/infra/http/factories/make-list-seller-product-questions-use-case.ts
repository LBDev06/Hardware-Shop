import { ListSellerProductQuestionsUseCase } from "@/domain/marketplace/app/use-cases/list-seller-product-questions";
import { PrismaQuestionRepository } from "@/infra/db/repo/prisma-question-repository";
import { PrismaUsersRepository } from "@/infra/db/repo/prisma-users-repository";

export function makeListSellerProductQuestionsUseCase(){
    const usersRepository = new PrismaUsersRepository()
    const questionsRepository = new PrismaQuestionRepository()
    const listSellerProductQuestionsUseCase = new ListSellerProductQuestionsUseCase(usersRepository, questionsRepository)
    
   return listSellerProductQuestionsUseCase
}