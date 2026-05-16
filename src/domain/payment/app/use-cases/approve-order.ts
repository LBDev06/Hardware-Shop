import { OrderRepository } from "../repo/order-repository";
import { Either, left, right } from "@/core/either";
import { Order } from "../../enterprise/entities/order";

interface ApproveOrderUseCaseRequest {
    orderId: string;
}

type ApproveOrderUseCaseResponse = Either<
    Error,
    { order: Order }
>

export class ApproveOrderUseCase {
    constructor(private orderRepository: OrderRepository) {}

    async execute({
        orderId
    }: ApproveOrderUseCaseRequest): Promise<ApproveOrderUseCaseResponse> {
        const order = await this.orderRepository.findById(orderId)

        if (!order) {
            return left(new Error('Order not found'))
        }

        order.confirm()
        await this.orderRepository.save(order)

        return right({
            order
        })
    }
}
