import { FastifyInstance } from "fastify";
import { loginRequired } from "../middleware/login-required";
import { verifyJwt } from "../middleware/verify-jwt";
import { addProductToCartController } from "../controller/add-product-to-cart-controller";
import { getUserProductCartController } from "../controller/get-user-product-cart-controller";

export function cartRoutes(app: FastifyInstance) {
  app.post(
    "/cart/add/:productId",
    { onRequest: [verifyJwt, loginRequired] },
    addProductToCartController,
  );
    app.get(
    "/cart/items",
    { onRequest: [verifyJwt, loginRequired] },
    getUserProductCartController,
  );
 
}

