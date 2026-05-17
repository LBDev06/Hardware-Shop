import { Either, right } from "@/core/either";
import { Order } from "../../enterprise/entities/order";
import { ProductRepository } from "@/domain/marketplace/app/repo/product-repository";
import { OrderRepository } from "../repo/order-repository";

interface ListOrderConfirmedBySellerUseCaseRequest {
    sellerId: string;
}

type ListOrderConfirmedBySellerUseCaseResponse = Either<null, {
    orders: Order[]
}>

export class ListOrderConfirmedBySellerUseCase {
    constructor(
        private orderRepository: OrderRepository,
        private productRepository: ProductRepository
    ) { }

    async execute({
        sellerId
    }: ListOrderConfirmedBySellerUseCaseRequest): Promise<ListOrderConfirmedBySellerUseCaseResponse> {
        const products = await this.productRepository.findManyProductsBySellerId(sellerId, { page: 1 })

        if (!products || products.length === 0) {
            return right({
                orders: []
            })
        }

        const productIds = products.map(product => product.id.toString())

        const orders = await this.orderRepository.findManyConfirmedOrdersByProductIds(productIds)

        const isConfimerdOrder = orders.filter(order => order.status === 'CONFIRMED')

        return right({
            orders: isConfimerdOrder
        })
    }
}