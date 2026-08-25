import { CheckoutUseCase } from "@/domain/payment/app/use-cases/checkout";
import { StripePaymentGateway } from "@/domain/payment/infra/payments/stripe-payment-gateway";
import { PrismaOrderRepository } from "@/infra/db/repo/prisma-order-repository";
import { stripe } from "@/infra/libs/stripe";

export function makeCheckoutUseCase() {
  const orderRepository = new PrismaOrderRepository();
  const paymentGateway = new StripePaymentGateway(stripe);
  const checkoutUseCase = new CheckoutUseCase(orderRepository, paymentGateway);

  return checkoutUseCase;
}
