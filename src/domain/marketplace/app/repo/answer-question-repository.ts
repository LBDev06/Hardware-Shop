import { AnswerQuestion } from "../../enterprise/entities/answer-question";
import { PaginationParams } from "@/core/repo/pagination-params";

export interface AnswerQuestionRepository {
    findById(id: string): Promise<AnswerQuestion | null>
    save(answerQuestion: AnswerQuestion): Promise<void>
    delete(id: string): Promise<void>
    findManyAnswersByQuestionId(questionId: string, params: PaginationParams): Promise<AnswerQuestion[]>
}