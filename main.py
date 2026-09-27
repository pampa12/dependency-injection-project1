from payment import CreditCardPayment, PayPalPayment
from order_service import Order, OrderService


order = Order("A1001", 49.99)

print("=== Credit card checkout ===")
credit_card_service = OrderService(CreditCardPayment("1234"))
print(credit_card_service.checkout(order))

print("\n=== PayPal checkout ===")
paypal_service = OrderService(PayPalPayment("pampa@example.com"))
print(paypal_service.checkout(order))

print("\nSame OrderService, different payment method.")
