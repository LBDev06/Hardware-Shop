import { FastifyInstance } from "fastify";
import { loginRequired } from "../middleware/login-required";
import { verifyJwt } from "../middleware/verify-jwt";
import { addProductToCartController } from "../controller/add-product-to-cart-controller";

export function cartRoutes(app: FastifyInstance) {
  app.post(
    "/cart/add/:productId",
    { onRequest: [verifyJwt, loginRequired] },
    addProductToCartController,
  );
}
