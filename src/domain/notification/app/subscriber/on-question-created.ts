import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { ProductRepository } from "@/domain/marketplace/app/repo/product-repository";
import { QuestionCreatedEvent } from "@/domain/marketplace/enterprise/events/question-created-event";
import { SendNotificationUseCase } from "../use-case/send-notification";

export class OnQuestionCreated implements EventHandler {
    constructor(
        private productRepository: ProductRepository,
        private sendNotificationUseCase: SendNotificationUseCase
    ) {
        this.setupSubscriptions()
    }

    setupSubscriptions(): void {
        DomainEvents.register(
            this.sendNewQuestionNotification.bind(this),
            QuestionCreatedEvent.name
        )
    }

    private async sendNewQuestionNotification(event: QuestionCreatedEvent) {
        const product = await this.productRepository.findById(event.question.productId.toString())

        if (!product) return

        await this.sendNotificationUseCase.execute({
            recipientId: product.authorId.toString(),
            title: `Nova pergunta em ${product.name}`,
            content: event.question.content.substring(0, 40).concat('...')
        })

        console.log(event.question)
    }

}