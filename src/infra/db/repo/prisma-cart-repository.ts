import { CartRepository } from "@/domain/marketplace/app/repo/cart-repository";
import { Cart } from "@/domain/marketplace/enterprise/entities/cart";
import { db } from "../libs/prisma";
import { PrismaCartMapper } from "../mappers/prisma-cart-mapper";

export class PrismaCartRepository implements CartRepository {
    async save(cart: Cart): Promise<void> {
        const { id, ...cartData } = PrismaCartMapper.toPrisma(cart)

        await db.$transaction(async (tx) => {
            const persistedCart = await tx.cart.upsert({
                where: {
                    userId: cart.userId.toString(),
                },
                create: {
                    id,
                    ...cartData,
                },
                update: cartData,
            })

            await tx.cartProduct.deleteMany({
                where: {
                    cartId: persistedCart.id,
                    productId: {
                        notIn: cart.items.getItems().map((item) => item.productId.toString()),
                    },
                },
            })

            await Promise.all(cart.items.getItems().map((item) =>
                tx.cartProduct.upsert({
                    where: {
                        cartId_productId: {
                            cartId: persistedCart.id,
                            productId: item.productId.toString(),
                        },
                    },
                    create: {
                        cartId: persistedCart.id,
                        productId: item.productId.toString(),
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                    },
                    update: {
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                    },
                }),
            ))
        })
    }

    async findByExistingCart(userId: string): Promise<Cart | null> {
        const cart = await db.cart.findUnique({
            where: {
                userId,
            },
            include: {
                items: true,
            },
        })

        if (!cart) return null

        return PrismaCartMapper.toDomain(cart)
    }
}
