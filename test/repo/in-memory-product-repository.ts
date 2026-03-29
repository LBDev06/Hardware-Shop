import { ProductRepository } from "@/domain/marketplace/app/repo/product-repository";
import { Product } from "@/domain/marketplace/enterprise/entities/product";

export class InMemoryProductsRepository implements ProductRepository {
    public products: Product[] = []

    async create(product: Product): Promise<Product> {
        this.products.push(product)
        return product
    }
}