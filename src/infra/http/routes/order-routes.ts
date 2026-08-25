import { FastifyInstance } from "fastify";
import { loginRequired } from "../middleware/login-required";
import { verifyJwt } from "../middleware/verify-jwt";
import { checkoutController } from "../controller/checkout-controller";
import { approveOrderController } from "../controller/approve-order-controller";
import { rejectOrderController } from "../controller/reject-order-controller";
import { listOrderHistoryController } from "../controller/list-order-history-controller";
import { listPendingOrdersBySellerController } from "../controller/list-pending-orders-by-seller-controller";
import { listOrderConfirmedBySellerController } from "../controller/list-order-confirmed-by-seller-controller";

const orderSchemaProperties = {
  id: { type: "string", format: "uuid", example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" },
  status: { type: "string", enum: ["PENDING", "CONFIRMED", "CANCELED"], example: "PENDING" },
  totalValue: { type: "number", example: 450000 },
  createdAt: { type: "string", format: "date-time" },
  items: {
    type: "array",
    items: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid" },
        clientId: { type: "string", format: "uuid" },
        productId: { type: "string", format: "uuid" },
        productName: { type: "string", example: "Placa de Vídeo RTX 4070" },
        quantity: { type: "integer", example: 1 },
        price: { type: "number", example: 450000 },
      },
    },
  },
};

export function orderRoutes(app: FastifyInstance) {
  app.post(
    "/orders/checkout",
    {
      onRequest: [verifyJwt, loginRequired],
      schema: {
        tags: ["Orders & Checkout"],
        summary: "Realizar checkout e criar pedido",
        description:
          "Cria um novo pedido com os itens, processa o pagamento via Stripe Gateway e dispara o OrderCreatedEvent (Domain Event persistido no Transactional Outbox e enviado aos ouvintes).",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["productId", "productName", "quantity", "price", "paymentMethodId"],
          properties: {
            productId: { type: "string", format: "uuid", example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" },
            productName: { type: "string", example: "Placa de Vídeo RTX 4070" },
            quantity: { type: "integer", minimum: 1, example: 1 },
            price: { type: "number", minimum: 1, example: 450000, description: "Preço em centavos" },
            paymentMethodId: { type: "string", example: "pm_card_visa", description: "Identificador do método de pagamento no Stripe" },
          },
        },
        response: {
          201: {
            description: "Pedido criado e pagamento processado com sucesso",
            type: "object",
            properties: {
              order: {
                type: "object",
                properties: orderSchemaProperties,
              },
            },
          },
          400: {
            description: "Pagamento recusado ou dados inválidos",
            type: "object",
            properties: {
              message: { type: "string", example: "Payment declined by gateway" },
            },
          },
          401: { description: "Não autorizado", type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    checkoutController,
  );

  app.patch(
    "/orders/:orderId/approve",
    {
      onRequest: [verifyJwt, loginRequired],
      schema: {
        tags: ["Orders & Checkout"],
        summary: "Aprovar pedido",
        description: "Atualiza o status do pedido para CONFIRMED.",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["orderId"],
          properties: {
            orderId: { type: "string", format: "uuid", example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" },
          },
        },
        response: {
          200: {
            description: "Pedido aprovado com sucesso",
            type: "object",
            properties: {
              order: {
                type: "object",
                properties: orderSchemaProperties,
              },
            },
          },
          401: { description: "Não autorizado", type: "object", properties: { message: { type: "string" } } },
          404: { description: "Pedido não encontrado", type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    approveOrderController,
  );

  app.patch(
    "/orders/:orderId/reject",
    {
      onRequest: [verifyJwt, loginRequired],
      schema: {
        tags: ["Orders & Checkout"],
        summary: "Rejeitar / Cancelar pedido",
        description: "Atualiza o status do pedido para CANCELED.",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["orderId"],
          properties: {
            orderId: { type: "string", format: "uuid", example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" },
          },
        },
        response: {
          200: {
            description: "Pedido cancelado com sucesso",
            type: "object",
            properties: {
              order: {
                type: "object",
                properties: orderSchemaProperties,
              },
            },
          },
          401: { description: "Não autorizado", type: "object", properties: { message: { type: "string" } } },
          404: { description: "Pedido não encontrado", type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    rejectOrderController,
  );

  app.get(
    "/orders/history",
    {
      onRequest: [verifyJwt, loginRequired],
      schema: {
        tags: ["Orders & Checkout"],
        summary: "Histórico de pedidos do cliente",
        description: "Retorna a listagem de todos os pedidos realizados pelo cliente autenticado.",
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: "Histórico de pedidos",
            type: "object",
            properties: {
              orders: {
                type: "array",
                items: {
                  type: "object",
                  properties: orderSchemaProperties,
                },
              },
            },
          },
          401: { description: "Não autorizado", type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    listOrderHistoryController,
  );

  app.get(
    "/orders/seller/pending",
    {
      onRequest: [verifyJwt, loginRequired],
      schema: {
        tags: ["Orders & Checkout"],
        summary: "Pedidos pendentes do vendedor",
        description: "Retorna todos os pedidos pendentes (PENDING) associados aos produtos vendidos pelo vendedor autenticado.",
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: "Lista de pedidos pendentes",
            type: "object",
            properties: {
              orders: {
                type: "array",
                items: {
                  type: "object",
                  properties: orderSchemaProperties,
                },
              },
            },
          },
          401: { description: "Não autorizado", type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    listPendingOrdersBySellerController,
  );

  app.get(
    "/orders/seller/confirmed",
    {
      onRequest: [verifyJwt, loginRequired],
      schema: {
        tags: ["Orders & Checkout"],
        summary: "Pedidos confirmados do vendedor",
        description: "Retorna todos os pedidos confirmados (CONFIRMED) associados aos produtos vendidos pelo vendedor autenticado.",
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: "Lista de pedidos confirmados",
            type: "object",
            properties: {
              orders: {
                type: "array",
                items: {
                  type: "object",
                  properties: orderSchemaProperties,
                },
              },
            },
          },
          401: { description: "Não autorizado", type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    listOrderConfirmedBySellerController,
  );
}

