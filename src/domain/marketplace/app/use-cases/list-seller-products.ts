import { Product } from "../../enterprise/entities/product";
import { ProductRepository } from "../repo/product-repository";
import { Either, right } from "@/core/either";

interface ListSellerPoductsUseCaseRequest {
    userId: string;
    page: number
}

type ListSellerPoductsUseCaseResponse = Either<null, {
    products: Product[] | null
}>

export class ListSellerPoductsUseCase {
    constructor(
        private productsRepository: ProductRepository
    ) { }

    async executer({
        page,
        userId
    }: ListSellerPoductsUseCaseRequest): Promise<ListSellerPoductsUseCaseResponse> {

        const products = await this.productsRepository.findManyProductsBySellerId(userId, { page })

        return right({
            products
        })
    }
}