import { QuestionRepository } from "@/domain/marketplace/app/repo/question-repository";
import { Question } from "@/domain/marketplace/enterprise/entities/question";
import { db } from "../libs/prisma";
import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper";
import { PaginationParams } from "@/core/repo/pagination-params";

export class PrismaQuestionRepository implements QuestionRepository {
    async save(question: Question): Promise<void> {
        const data = PrismaQuestionMapper.toPrisma(question);

        await db.question.upsert({
            where: {
                id: question.id.toString(),
            },
            create: data,
            update: data,
        });
    }

    async findById(id: string): Promise<Question | null> {
        const question = await db.question.findUnique({
            where: {
                id,
            },
        });

        if (!question) return null;

        return PrismaQuestionMapper.toDomain(question);
    }

    async delete(question: Question): Promise<void> {
        await db.question.delete({
            where: {
                id: question.id.toString(),
            },
        });
    }

    async findManyQuestionsBySellerId(sellerId: string, params: PaginationParams): Promise<Question[]> {
        const questions = await db.question.findMany({
            where: {
                product: {
                    authorId: sellerId,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            skip: (params.page - 1) * 20,
            take: 20,
        });

        return questions.map(PrismaQuestionMapper.toDomain);
    }

    async findManyQuestionsByProductId(productId: string, params: PaginationParams): Promise<Question[]> {
        const questions = await db.question.findMany({
            where: {
                productId,
            },
            orderBy: {
                createdAt: "desc",
            },
            skip: (params.page - 1) * 20,
            take: 20,
        });

        return questions.map(PrismaQuestionMapper.toDomain);
    }
}