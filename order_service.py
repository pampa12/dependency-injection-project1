class Order:
    def __init__(self, order_id, total):
        self.order_id = order_id
        self.total = total


class OrderService:
    def __init__(self, payment_processor):
        self.payment_processor = payment_processor

    def checkout(self, order):
        if order.total <= 0:
            raise ValueError("Order total must be greater than zero.")

        paid = self.payment_processor.pay(order.total)

        if not paid:
            raise RuntimeError("Payment failed.")

        return f"Order {order.order_id} completed."
