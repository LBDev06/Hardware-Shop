import { PaginationParams } from "@/core/repo/pagination-params";
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

        if (!product) {
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

    async findManyProducts({ page }: PaginationParams): Promise<Product[]> {
        const product = this.products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice((page - 1) * 20, page * 20)

        return product
    }

    async searchProduct(query: string): Promise<Product[]> {
        const product = this.products.filter(product => product.name.toLowerCase().includes(query.toLowerCase()))
        return product
    }

    async findManyProductsBySellerId(sellerId: string, { page }: PaginationParams): Promise<Product[] | null> {
        const product = this.products.filter(product => product.authorId.toString() === sellerId)
            .slice((page - 1) * 20, page * 20)

        return product
    }
}