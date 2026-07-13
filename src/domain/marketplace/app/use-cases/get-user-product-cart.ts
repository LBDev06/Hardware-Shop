import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Cart } from "../../enterprise/entities/cart";
import { CartRepository } from "../repo/cart-repository";

interface GetUserProductCartUseCaseRequest {
  userId: string;
}

type GetUserProductCartUseCaseResponse = Either<
  ResourceNotFoundError,
  { cart: Cart }
>;

export class GetUserProductCartUseCase {
  constructor(private cartRepository: CartRepository) {}

  async execute({
    userId,
  }: GetUserProductCartUseCaseRequest): Promise<GetUserProductCartUseCaseResponse> {
    const cart = await this.cartRepository.findByExistingCart(userId);

    if (!cart) {
      return left(new ResourceNotFoundError());
    }

    return right({ cart });
  }
}
