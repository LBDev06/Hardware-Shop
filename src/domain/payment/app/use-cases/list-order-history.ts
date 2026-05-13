import { Either } from "@/core/either";
import { Order } from "../../enterprise/entities/order";
import { OrderRepository } from "../repo/order-repository";
import { right } from "@/core/either";

interface ListOrderHistoryUseCaseRequest {
    clientId: string;
}

type ListOrderHistoryUseCaseResponse = Either<null, {
    orders: Order[] | null
}>

export class ListOrderHistoryUseCase {
    constructor(
        private orderRepository: OrderRepository
    ) { }

    async execute({
        clientId
    }: ListOrderHistoryUseCaseRequest): Promise<ListOrderHistoryUseCaseResponse> {

        const orders = await this.orderRepository.findManyOrdersByClientId(clientId)

        return right({ orders })

    }

}