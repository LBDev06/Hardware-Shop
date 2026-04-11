import { Either, left, right } from "@/core/either";
import { UserNotAllowedError } from "@/core/errors/user-not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { RequiredUpdateFieldError } from "@/core/errors/required-update-field-error";
import { Product } from "../../enterprise/entities/product";
import { UsersRepository } from "../repo/users-repository";
import { ProductRepository } from "../repo/product-repository";
import { SpecInput } from "../../enterprise/value-objects/product-specs";
import { ProductAttachmentRepository } from "../repo/product-attachment-repository";

interface EditProductUseCaseRequest {
  authorId: string;
  productId: string;
  name?: string;
  price?: number;
  stock?: number;
  description?: string;
  specs?: SpecInput;
  category?: string;
  attachmentsIds?: string[];
}

type EditProductUseCaseResponse = Either<
  UserNotAllowedError | ResourceNotFoundError | RequiredUpdateFieldError,
  { product: Product }
>;

export class EditProductUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private productAttachmentRepository: ProductAttachmentRepository,
    private productsRepository: ProductRepository,
  ) { }

  async execute({
    productId,
    authorId,
    name,
    price,
    stock,
    description,
    specs,
    category,
    attachmentsIds
  }: EditProductUseCaseRequest): Promise<EditProductUseCaseResponse> {
    const user = await this.usersRepository.findById(authorId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const product = await this.productsRepository.findById(productId);

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    if (product.authorId !== user.id) {
      return left(new UserNotAllowedError());
    }

    if (category !== product.category.value && !specs) {
      return left(new RequiredUpdateFieldError());
    }

    product.updateCategoryAndSpecs(specs, category)

    if (attachmentsIds) {
      const currentProductAttachments = await this.productAttachmentRepository.findManyByProductId(productId)
      product.updateAttachments(currentProductAttachments, attachmentsIds, product.id)
    }

    if (name) product.name = name;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (description) product.description = description;

    await this.productsRepository.save(product);

    return right({ product });
  }
}