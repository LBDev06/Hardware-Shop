import { Product } from "../../enterprise/entities/product";

export interface ProductRepository {
    create(user: Product): Promise<Product>
}