import { PaginationParams } from "@/core/repo/pagination-params";
import { Product } from "../../enterprise/entities/product";

export interface ProductRepository {
    create(product: Product): Promise<Product>
    findById(id: string): Promise<Product | null>
    save(product: Product): Promise<void>
    delete(product: string): Promise<void>
    findManyProducts(params: PaginationParams): Promise<Product[]>
    searchProduct(query: string): Promise<Product[] | null>
}