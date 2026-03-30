import { Either, left , right} from "@/core/either";
import { ProductRepository } from "../repo/product-repository";
import { UsersRepository } from "../repo/users-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UserNotAllowedError } from "@/core/errors/user-not-allowed-error";

interface  DeleteProductUseCaseRequest {
    authorId: string;
    productId: string;
}

type DeleteProductUseCaseResponse = Either<ResourceNotFoundError | UserNotAllowedError, {}>

export class DeleteProductUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private  productsRepository: ProductRepository
  ){}

  async execute({
    authorId,
    productId
  }: DeleteProductUseCaseRequest): Promise<DeleteProductUseCaseResponse> {
  const user = await this.usersRepository.findById(authorId)

  if(!user){
    return left(new ResourceNotFoundError())
  }

  const product  = await this.productsRepository.findById(productId)

  if(!product){
    return left(new ResourceNotFoundError())
  }

  if(product.authorId !== user.id){
    return left(new UserNotAllowedError())
  }

  await this.productsRepository.delete(productId)

  return right({})

  }

}