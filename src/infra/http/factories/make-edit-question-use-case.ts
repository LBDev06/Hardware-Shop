import { EditQuestionUseCase } from "@/domain/marketplace/app/use-cases/edit-question";
import { PrismaQuestionRepository } from "@/infra/db/repo/prisma-question-repository";

export function makeEditQuestionUseCase(){
    const questionsRepository = new PrismaQuestionRepository()
    const editQuestionUseCase = new EditQuestionUseCase(questionsRepository)

    return editQuestionUseCase
}