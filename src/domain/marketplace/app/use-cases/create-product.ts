import { Either, left, right } from "@/core/either";
import { ProductRepository } from "../repo/product-repository";
import { Product } from "../../enterprise/entities/product";
import { UsersRepository } from "../repo/users-repository";
import { UserNotAllowedError } from "@/core/errors/user-not-allowed-error";
import { ProductCategory } from "../../enterprise/value-objects/product-category";
import { ProductSpecs, HardwareSpec } from "../../enterprise/value-objects/product-specs";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { ProductAttachment } from "../../enterprise/entities/product-attachment";
import { UniqueEntityId } from "@/core/unique-entity-id";

interface CreateProductUseCaseRequest {
  userId: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  specs: HardwareSpec[];
  attachmentsIds: string[];
  category: string;
}

export type CreateProductUseCaseResponse = Either<
  ResourceNotFoundError | UserNotAllowedError,
  { product: Product }
>

export class CreateProductUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private productRepository: ProductRepository
  ) { }

  async execute({
    userId,
    name,
    price,
    stock,
    specs,
    description,
    category,
    attachmentsIds
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {

    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    if (user.role.value !== 'seller') {
      return left(new UserNotAllowedError())
    }

    const categoryVO = ProductCategory.create(category);

    const specsVO = ProductSpecs.create(
      specs,
      categoryVO.value
    );

    const product = Product.create({
      authorId: user.id,
      name,
      price,
      stock,
      description,
      category: categoryVO,
      specs: specsVO,
    });

    const productAttachments = attachmentsIds.map(id => {
      return ProductAttachment.create({
        attachmentId: new UniqueEntityId(id),
        productId: product.id
      })
    })

    product.attachments = productAttachments
    await this.productRepository.create(product)

    return right({
      product
    })
  }
}