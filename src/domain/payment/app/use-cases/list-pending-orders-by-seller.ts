import { Either, right } from "@/core/either";
import { Order } from "../../enterprise/entities/order";
import { OrderRepository } from "../repo/order-repository";
import { ProductRepository } from "@/domain/marketplace/app/repo/product-repository";

interface ListPendingOrdersBySellerUseCaseRequest {
    sellerId: string;
}

type ListPendingOrdersBySellerUseCaseResponse = Either<null, {
    orders: Order[]
}>

export class ListPendingOrdersBySellerUseCase {
    constructor(
        private orderRepository: OrderRepository,
        private productRepository: ProductRepository
    ) { }

    async execute({
        sellerId
    }: ListPendingOrdersBySellerUseCaseRequest): Promise<ListPendingOrdersBySellerUseCaseResponse> {
        const products = await this.productRepository.findManyProductsBySellerId(sellerId, { page: 1 })

        if (!products || products.length === 0) {
            return right({ orders: [] })
        }

        const productIds = products.map((product) => product.id.toString())

        const orders = await this.orderRepository.findManyPendingOrdersByProductIds(productIds)

        const isPedingOrder = orders.filter((order) => order.status === 'PENDING')

        return right({ orders: isPedingOrder })
    }
}
