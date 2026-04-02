import { ProductRepository } from "../repo/product-repository";
import { Either, right } from "@/core/either";
import { Product } from "../../enterprise/entities/product";

interface SearchProductUseCaseRequest {
    query: string
}

type SearchProductUseCaseResponse = Either<null, {
    product: Product[] | null
}>

export class SearchProductUseCase {
    constructor(private productsRepository: ProductRepository) { }

    async execute({
        query
    }: SearchProductUseCaseRequest): Promise<SearchProductUseCaseResponse> {
        const product = await this.productsRepository.searchProduct((query))

        return right({
            product
        })

    }
}