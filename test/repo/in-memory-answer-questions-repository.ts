import { AnswerQuestionRepository } from "@/domain/marketplace/app/repo/answer-question-repository";
import { AnswerQuestion } from "@/domain/marketplace/enterprise/entities/answer-question";

export class InMemoryAnswerQuestionsRepository implements AnswerQuestionRepository {
    public answerQuestion: AnswerQuestion[] = []

    async save(answerQuestion: AnswerQuestion): Promise<void> {
        this.answerQuestion.push(answerQuestion)
    }

}