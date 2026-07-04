import { FastifyInstance } from "fastify";
import { loginRequired } from "../middleware/login-required";
import { verifyJwt } from "../middleware/verify-jwt";
import { createProductController } from "../controller/create-product-controller";
import { deleteProductController } from "../controller/delete-product-controller";

export function productRoutes(app: FastifyInstance) {
  app.post(
    "/product/create",
    { onRequest: [verifyJwt, loginRequired] },
    createProductController
  );
    app.delete(
    "/product/:productId/delete",
    { onRequest: [verifyJwt, loginRequired] },
    deleteProductController
  );
}
