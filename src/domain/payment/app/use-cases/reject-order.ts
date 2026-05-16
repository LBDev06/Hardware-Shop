import { OrderRepository } from "../repo/order-repository";
import { Either, left, right } from "@/core/either";
import { Order } from "../../enterprise/entities/order";

interface RejectOrderUseCaseRequest {
    orderId: string;
}

type RejectOrderUseCaseResponse = Either<
    Error,
    { order: Order }
>

export class RejectOrderUseCase {
    constructor(private orderRepository: OrderRepository) {}

    async execute({
        orderId
    }: RejectOrderUseCaseRequest): Promise<RejectOrderUseCaseResponse> {
        const order = await this.orderRepository.findById(orderId)

        if (!order) {
            return left(new Error('Order not found'))
        }

        order.cancel()
        await this.orderRepository.save(order)

        return right({
            order
        })
    }
}
