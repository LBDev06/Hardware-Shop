import { Either, left, right } from "@/core/either";
import { ProductRepository } from "../repo/product-repository";
import { Product } from "../../enterprise/entities/product";
import { UsersRepository } from "../repo/users-repository";
import { UserNotAllowedError } from "@/core/errors/user-not-allowed-error";
import { UserAlreadyExistsError } from "@/core/errors/user-already-exists-error"; // Talvez trocar para ResourceNotFoundError no futuro
import { ProductCategory, HardwareType } from "../../enterprise/value-objects/product-category";
import { ProductSpecs, HardwareSpec } from "../../enterprise/value-objects/product-specs";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

interface CreateProductUseCaseRequest {
  userId: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  specs: HardwareSpec[]; 
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
  ) {}

  async execute({
    userId,
    name,
    price,
    stock,
    specs,
    description,
    category, 
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
    name,
    price,
    stock,
    description,
    category: categoryVO,
    specs: specsVO,
  });

    await this.productRepository.create(product)

    return right({
      product
    })
  }
}