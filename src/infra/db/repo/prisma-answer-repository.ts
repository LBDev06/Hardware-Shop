import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repo/pagination-params";
import { AnswerQuestionRepository } from "@/domain/marketplace/app/repo/answer-question-repository";
import { AnswerQuestion } from "@/domain/marketplace/enterprise/entities/answer-question";
import { db } from "../libs/prisma";
import { PrismaAnswerMapper } from "../mappers/prisma-answer-mapper";

export class PrismaAnswerRepository implements AnswerQuestionRepository {
    async save(answerQuestion: AnswerQuestion): Promise<void> {
        const data = PrismaAnswerMapper.toPrisma(answerQuestion)

        await db.answer.upsert({
            where: {
                id: answerQuestion.id.toString(),
            },
            create: data,
            update: data,
        })

        DomainEvents.dispatchEventsForAggregate(answerQuestion.id)
    }
    
    async findById(id: string): Promise<AnswerQuestion | null> {
        const answer = await db.answer.findUnique({
            where: {
                id,
            },
        })

        if (!answer) return null

        return PrismaAnswerMapper.toDomain(answer)
    } 

    async delete(id: string): Promise<void> {
        await db.answer.delete({
            where: {
                id,
            },
        })
    }

    async findManyAnswersByQuestionId(questionId: string, params: PaginationParams): Promise<AnswerQuestion[]> {
        const answers = await db.answer.findMany({
            where: {
                questionId,
            },
            orderBy: {
                createdAt: "desc",
            },
            skip: (params.page - 1) * 20,
            take: 20,
        })

        return answers.map(PrismaAnswerMapper.toDomain)
    }
}
