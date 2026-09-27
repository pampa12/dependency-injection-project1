import unittest

from order_service import Order, OrderService
from payment import FakePayment


class OrderServiceTests(unittest.TestCase):
    def test_checkout_uses_fake_payment(self):
        fake_payment = FakePayment()
        service = OrderService(fake_payment)

        order = Order("TEST-1", 25.00)
        result = service.checkout(order)

        self.assertEqual(result, "Order TEST-1 completed.")
        self.assertEqual(fake_payment.amounts_paid, [25.00])


if __name__ == "__main__":
    unittest.main()
