class CreditCardPayment:
    def __init__(self, card_last_four="4242"):
        self.card_last_four = card_last_four

    def pay(self, amount):
        print(
            f"Paid ${amount:.2f} by credit card "
            f"ending in {self.card_last_four}."
        )
        return True


class PayPalPayment:
    def __init__(self, email="student@example.com"):
        self.email = email

    def pay(self, amount):
        print(
            f"Paid ${amount:.2f} using PayPal account {self.email}."
        )
        return True


class ApplePayPayment:
    def __init__(self, device_name="iPhone"):
        self.device_name = device_name

    def pay(self, amount):
        print(
            f"Paid ${amount:.2f} using Apple Pay on {self.device_name}."
        )
        return True


class FakePayment:
    def __init__(self):
        self.amounts_paid = []

    def pay(self, amount):
        self.amounts_paid.append(amount)
        return True
