import { Either, left, right } from "@/core/either";
import { UserNotAllowedError } from "@/core/errors/user-not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { RequiredUpdateFieldError } from "@/core/errors/required-update-field-error";
import { Product } from "../../enterprise/entities/product";
import { UsersRepository } from "../repo/users-repository";
import { ProductRepository } from "../repo/product-repository";
import { ProductCategory } from "../../enterprise/value-objects/product-category";
import { ProductSpecs, SpecInput } from "../../enterprise/value-objects/product-specs";

interface EditProductUseCaseRequest {
  authorId: string;
  productId: string;
  name?: string;
  price?: number;
  stock?: number;
  description?: string;
  specs?: SpecInput;
  category?: string;
}

type EditProductUseCaseResponse = Either<
  UserNotAllowedError | ResourceNotFoundError | RequiredUpdateFieldError,
  { product: Product }
>;

export class EditProductUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private productsRepository: ProductRepository,
  ) {}

  async execute({
    productId,
    authorId,
    name,
    price,
    stock,
    description,
    specs,
    category,
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

    if (category && !specs) {
      return left(new RequiredUpdateFieldError());
    }

    if (category) {
      const newCategory = ProductCategory.create(category);
      product.category = newCategory;
    }

    if (specs) {
      const targetCategory = product.category.value;
      product.specs = ProductSpecs.create(specs, targetCategory);
    }

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (description !== undefined) product.description = description;

    await this.productsRepository.save(product);

    return right({ product });
  }
}