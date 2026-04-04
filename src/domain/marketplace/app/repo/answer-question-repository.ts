import { AnswerQuestion } from "../../enterprise/entities/answer-question";

export interface AnswerQuestionRepository {
    findById(id: string): Promise<AnswerQuestion | null>
    save(answerQuestion: AnswerQuestion): Promise<void>
    delete(id: string): Promise<void>
}