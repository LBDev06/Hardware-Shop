import { EventHandler } from "@/core/events/event-handler";
import { SendNotificationUseCase } from "../use-case/send-notification";
import { DomainEvents } from "@/core/events/domain-events";
import { AnswerQuestionsCreatedEvent } from "@/domain/marketplace/enterprise/events/answer-question-created";
import { QuestionRepository } from "@/domain/marketplace/app/repo/question-repository";

export class OnAnswerQuestionCreated implements EventHandler {
    constructor(
        private questionsRepository: QuestionRepository,
        private sendNotificationUseCase: SendNotificationUseCase
    ) { this.setupSubscriptions() }

    setupSubscriptions(): void {
        DomainEvents.register(
            this.sendAnswerQuestionNotification.bind(this),
            AnswerQuestionsCreatedEvent.name
        )
    }

    private async sendAnswerQuestionNotification(event: AnswerQuestionsCreatedEvent) {
        const question = await this.questionsRepository.findById(event.answerQuestion.questionId.toString())

        if (!question) return

        await this.sendNotificationUseCase.execute({
            recipientId: question.authorId.toString(),
            title: 'Nova resposta em sua pergunta',
            content: event.answerQuestion.content.substring(0, 40).concat('...'),
            eventType: "ANSWER_QUESTION_CREATED",
        })

        console.log(event.answerQuestion)
    }

}