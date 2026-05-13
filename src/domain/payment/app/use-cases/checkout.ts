import { OrderRepository } from "../repo/order-repository";
import { PaymentGateway } from "../gateways/payment-gateway";
import { Order } from "../../enterprise/entities/order";
import { OrderItem } from "../../enterprise/entities/order-item";
import { Either, right } from "@/core/either";
import { UniqueEntityId } from "@/core/unique-entity-id";

interface CheckoutUseCaseRequest {
    clientId: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    paymentMethodId: string;
}

type CheckoutUseCaseResponse = Either<
    null,
    { order: Order }
>

export class CheckoutUseCase {
    constructor(
        private orderRepository: OrderRepository,
        private paymentGateway: PaymentGateway
    ) { }

    async execute({
        clientId,
        productId,
        productName,
        quantity,
        price,
        paymentMethodId
    }: CheckoutUseCaseRequest): Promise<CheckoutUseCaseResponse> {

        const orderItem = OrderItem.create({
            clientId: new UniqueEntityId(clientId),
            productId: new UniqueEntityId(productId),
            productName,
            quantity,
            price
        })

        const order = Order.create({
            items: [orderItem],
        })

        await this.orderRepository.create(order)

        try {
            await this.paymentGateway.processPayment(
                order.totalValue,
                paymentMethodId
            );

            order.confirm()
            await this.orderRepository.save(order)

            return right({
                order
            });

        } catch (error) {
            order.cancel()
            await this.orderRepository.save(order)
            throw error
        }
    }
}