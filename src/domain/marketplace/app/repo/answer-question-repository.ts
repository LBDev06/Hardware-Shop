import { AnswerQuestion } from "../../enterprise/entities/answer-question";

export interface AnswerQuestionRepository {
    save(answerQuestion: AnswerQuestion): Promise<void>
}