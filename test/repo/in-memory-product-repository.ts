import { ProductRepository } from "@/domain/marketplace/app/repo/product-repository";
import { Product } from "@/domain/marketplace/enterprise/entities/product";

export class InMemoryProductsRepository implements ProductRepository {
    public products: Product[] = []

    async create(product: Product): Promise<Product> {
        this.products.push(product)
        return product
    }

    async findById(id: string): Promise<Product | null> {
        const product = this.products.find(product => product.id.toString() === id)
        
        if(!product){
            return null
        }
        return product
    }

    async save(product: Product): Promise<void> {
        const itemIndex = this.products.findIndex(item => item.id.toString() === product.id.toString())
        this.products[itemIndex] = product
    }

    async delete(product: string): Promise<void> {
        const productIndex = this.products.findIndex(item => item.id.toString() === product)
        this.products.splice(productIndex, 1)
    }
}