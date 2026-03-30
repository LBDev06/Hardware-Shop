import { Product } from "../../enterprise/entities/product";

export interface ProductRepository {
    create(product: Product): Promise<Product>
    findById(id: string): Promise<Product | null>
    save(product: Product): Promise<void>
    delete(product: string): Promise<void>
}