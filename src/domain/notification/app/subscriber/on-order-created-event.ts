import { EventHandler } from "@/core/events/event-handler";
import { OrderRepository } from "@/domain/payment/app/repo/order-repository";
import { SendNotificationUseCase } from "../use-case/send-notification";
import { DomainEvents } from "@/core/events/domain-events";
import { OrderCreatedEvent } from "@/domain/payment/enterprise/events/order-created-event";
import { ProductRepository } from "@/domain/marketplace/app/repo/product-repository";

export class OnOrderCreated implements EventHandler {
    constructor(
        private orderRepository: OrderRepository,
        private productRepository: ProductRepository,
        private sendNotificationRepository: SendNotificationUseCase
    ) { this.setupSubscriptions() }

    setupSubscriptions(): void {
        DomainEvents.register(
            this.sendNewOrderNotification.bind(this),
            OrderCreatedEvent.name
        )
    }

    private async sendNewOrderNotification(event: OrderCreatedEvent) {
        const order = await this.orderRepository.findById(event.order.id.toString())

        if (!order) return

        const product = await this.productRepository.findById(order.productId.toString())

        if (!product) return

        await this.sendNotificationRepository.execute({
            recipientId: product.authorId.toString(),
            title: 'Novo pedido',
            content: `Você teve um novo pedido que esta aguardando a sua aprovação, produto: ${order.productName}`,
            eventType: "ORDER_CREATED"
        })

    }

}