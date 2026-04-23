import { DomainEvent } from "@/core/events/domain-event";
import { AnswerQuestion } from "../entities/answer-question";

export class AnswerQuestionsCreatedEvent implements DomainEvent {
    public ocurredAt: Date
    public answerQuestion: AnswerQuestion

    constructor(answerQuestion: AnswerQuestion) {
        this.answerQuestion = answerQuestion
        this.ocurredAt = new Date()
    }
    getAggregateId() {
        return this.answerQuestion.id
    }
}