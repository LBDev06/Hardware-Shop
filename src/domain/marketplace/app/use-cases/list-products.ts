import { Either, right } from "@/core/either"
import { Product } from "../../enterprise/entities/product"
import { ProductRepository } from "../repo/product-repository"

interface ListProductsUseCaseRequest {
    page: number
}

type ListProductsUseCaseResponse = Either<null, {
    products: Product[]
}>

export class ListProductsUseCase {
    constructor(
        private productsRepository: ProductRepository
    ) { }

    async execute({
        page
    }: ListProductsUseCaseRequest): Promise<ListProductsUseCaseResponse> {
        const products = await this.productsRepository.findManyProducts({
            page
        })

        return right({
            products
        })
    }
}