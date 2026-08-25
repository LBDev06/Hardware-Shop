import { FastifyInstance } from "fastify";
import { loginRequired } from "../middleware/login-required";
import { verifyJwt } from "../middleware/verify-jwt";
import { checkoutController } from "../controller/checkout-controller";
import { approveOrderController } from "../controller/approve-order-controller";
import { rejectOrderController } from "../controller/reject-order-controller";
import { listOrderHistoryController } from "../controller/list-order-history-controller";
import { listPendingOrdersBySellerController } from "../controller/list-pending-orders-by-seller-controller";
import { listOrderConfirmedBySellerController } from "../controller/list-order-confirmed-by-seller-controller";

export function orderRoutes(app: FastifyInstance) {
  app.post(
    "/orders/checkout",
    { onRequest: [verifyJwt, loginRequired] },
    checkoutController,
  );

  app.patch(
    "/orders/:orderId/approve",
    { onRequest: [verifyJwt, loginRequired] },
    approveOrderController,
  );

  app.patch(
    "/orders/:orderId/reject",
    { onRequest: [verifyJwt, loginRequired] },
    rejectOrderController,
  );

  app.get(
    "/orders/history",
    { onRequest: [verifyJwt, loginRequired] },
    listOrderHistoryController,
  );

  app.get(
    "/orders/seller/pending",
    { onRequest: [verifyJwt, loginRequired] },
    listPendingOrdersBySellerController,
  );

  app.get(
    "/orders/seller/confirmed",
    { onRequest: [verifyJwt, loginRequired] },
    listOrderConfirmedBySellerController,
  );
}
