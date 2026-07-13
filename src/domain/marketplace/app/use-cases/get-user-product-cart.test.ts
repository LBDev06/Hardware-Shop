import { describe, expect, it } from "vitest";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Cart } from "../../enterprise/entities/cart";
import { InMemoryCartRepository } from "test/repo/in-memory-cart-repository";
import { GetUserProductCartUseCase } from "./get-user-product-cart";
import { UniqueEntityId } from "@/core/unique-entity-id";

describe("Get User Product Cart Use Case", () => {
  it("should be able to get a user's cart", async () => {
    const cartRepository = new InMemoryCartRepository();
    const sut = new GetUserProductCartUseCase(cartRepository);
    const cart = Cart.create({ userId: new UniqueEntityId("user-1") });

    await cartRepository.save(cart);

    const result = await sut.execute({ userId: "user-1" });

    expect(result).toBeRight();
    if (result.isRight()) {
      expect(result.value.cart).toBe(cart);
    }
  });

  it("should not be able to get a cart that does not exist", async () => {
    const sut = new GetUserProductCartUseCase(new InMemoryCartRepository());

    const result = await sut.execute({ userId: "user-1" });

    expect(result).toBeLeft();
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });
});
