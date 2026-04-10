import { Product, ProductProps } from "@/domain/marketplace/enterprise/entities/product"
import { UniqueEntityId } from "@/core/unique-entity-id"
import { ProductCategory } from "@/domain/marketplace/enterprise/value-objects/product-category"
import { ProductSpecs } from "@/domain/marketplace/enterprise/value-objects/product-specs"

export function makeProduct(
  override: Partial<ProductProps> = {},
  id?: UniqueEntityId
) {

  const category = override.category ?? ProductCategory.create("GPU");

  const specs = override.specs ?? ProductSpecs.create({
    vram: 12,
    tdp: 170,
    interface: 'PCIe 4.0',
    memoryType: 'GDDR6',
  }, category.value);

  const product = Product.create(
    {
      authorId: new UniqueEntityId(),
      name: "RTX 3060",
      price: 1300,
      stock: 10,
      description: "Placa de vídeo de excelente custo-benefício para Full HD.",
      category,
      specs,
      createdAt: new Date(),
      ...override,
    },
    id
  )

  return product
}