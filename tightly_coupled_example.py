from payment import CreditCardPayment


class Order:
    def __init__(self, order_id, total):
        self.order_id = order_id
        self.total = total


class TightlyCoupledOrderService:
    def __init__(self):
        self.payment_processor = CreditCardPayment()

    def checkout(self, order):
        self.payment_processor.pay(order.total)
        return f"Order {order.order_id} completed."
