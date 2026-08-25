import { FastifyInstance } from "fastify";
import { loginRequired } from "../middleware/login-required";
import { verifyJwt } from "../middleware/verify-jwt";
import { addProductToCartController } from "../controller/add-product-to-cart-controller";
import { getUserProductCartController } from "../controller/get-user-product-cart-controller";
import { deleteProductFromCartController } from "../controller/delete-product-from-cart-controller";

export function cartRoutes(app: FastifyInstance) {
  app.post(
    "/cart/add/:productId",
    {
      onRequest: [verifyJwt, loginRequired],
      schema: {
        tags: ["Cart"],
        summary: "Adicionar produto ao carrinho",
        description: "Adiciona um item ao carrinho de compras do usuário ou incrementa sua quantidade se já existir.",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["productId"],
          properties: {
            productId: { type: "string", format: "uuid", example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" },
          },
        },
        body: {
          type: "object",
          required: ["quantity"],
          properties: {
            quantity: { type: "integer", minimum: 1, example: 2 },
          },
        },
        response: {
          201: {
            description: "Produto adicionado ao carrinho com sucesso",
            type: "object",
            properties: {
              message: { type: "string", example: "Product added to cart." },
            },
          },
          401: { description: "Não autorizado", type: "object", properties: { message: { type: "string" } } },
          404: { description: "Produto não encontrado", type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    addProductToCartController,
  );

  app.get(
    "/cart/items",
    {
      onRequest: [verifyJwt, loginRequired],
      schema: {
        tags: ["Cart"],
        summary: "Obter carrinho de compras",
        description: "Retorna o carrinho do usuário autenticado com todos os itens, quantidades, preços unitários, quantidade total e valor total consolidado.",
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: "Carrinho de compras retornado",
            type: "object",
            properties: {
              cart: {
                type: "object",
                properties: {
                  id: { type: "string", format: "uuid" },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        productId: { type: "string", format: "uuid" },
                        name: { type: "string", example: "Placa de Vídeo RTX 4070" },
                        quantity: { type: "integer", example: 2 },
                        price: { type: "number", example: 450000 },
                      },
                    },
                  },
                  totalQuantity: { type: "integer", example: 2 },
                  totalValue: { type: "number", example: 900000 },
                },
              },
            },
          },
          401: { description: "Não autorizado", type: "object", properties: { message: { type: "string" } } },
          404: { description: "Carrinho não encontrado", type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    getUserProductCartController,
  );

  app.delete(
    "/cart/:productId/delete",
    {
      onRequest: [verifyJwt, loginRequired],
      schema: {
        tags: ["Cart"],
        summary: "Remover produto do carrinho",
        description: "Remove um item específico do carrinho de compras do usuário autenticado.",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["productId"],
          properties: {
            productId: { type: "string", format: "uuid", example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" },
          },
        },
        response: {
          200: {
            description: "Item removido do carrinho com sucesso",
            type: "object",
            properties: {
              message: { type: "string", example: "Product removed from cart." },
            },
          },
          401: { description: "Não autorizado", type: "object", properties: { message: { type: "string" } } },
          404: { description: "Item ou carrinho não encontrado", type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    deleteProductFromCartController,
  );
}

