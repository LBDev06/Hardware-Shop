import { AnswerQuestionRepository } from "@/domain/marketplace/app/repo/answer-question-repository";
import { AnswerQuestion } from "@/domain/marketplace/enterprise/entities/answer-question";
import { PaginationParams } from "@/core/repo/pagination-params";

export class InMemoryAnswerQuestionsRepository implements AnswerQuestionRepository {
    public answerQuestion: AnswerQuestion[] = []

    async findById(id: string): Promise<AnswerQuestion | null> {
        const answerQuestion = this.answerQuestion.find(answerQuestion => answerQuestion.id.toString() === id)

        if (!answerQuestion) {
            return null
        }
        return answerQuestion
    }

    async delete(id: string): Promise<void> {
        const answerQuestion = this.answerQuestion.find(answerQuestion => answerQuestion.id.toString() === id)

        if (!answerQuestion) {
            return
        }

        this.answerQuestion.splice(this.answerQuestion.indexOf(answerQuestion), 1)
    }

    async findManyAnswersByQuestionId(questionId: string, { page }: PaginationParams): Promise<AnswerQuestion[]> {
        const answerQuestion = this.answerQuestion.filter(answerQuestion => answerQuestion.questionId.toString() === questionId)
            .slice((page - 1) * 20, page * 20)

        return answerQuestion
    }

    async save(answerQuestion: AnswerQuestion): Promise<void> {
        this.answerQuestion.push(answerQuestion)
    }

}