import { UniqueEntityId } from "@/core/unique-entity-id";
import { Cart } from "@/domain/marketplace/enterprise/entities/cart";
import { CartProduct } from "@/domain/marketplace/enterprise/entities/cart-product";
import { CartProductList } from "@/domain/marketplace/enterprise/entities/cart-product-list";
import {
  Cart as PrismaCart,
  CartProduct as PrismaCartProduct,
} from "generated/prisma";

type PrismaCartWithItems = PrismaCart & {
  items: PrismaCartProduct[];
};

export class PrismaCartMapper {
  static toDomain(raw: PrismaCartWithItems): Cart {
    const items = raw.items.map((item) =>
      CartProduct.create(
        {
          productId: new UniqueEntityId(item.productId),
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        },
        new UniqueEntityId(item.id),
      ),
    );

    return Cart.create(
      {
        userId: new UniqueEntityId(raw.userId),
        items: new CartProductList(items),
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(cart: Cart) {
    return {
      id: cart.id.toString(),
      userId: cart.userId.toString(),
    };
  }
}
