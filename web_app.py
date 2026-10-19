from flask import Flask, jsonify, render_template, request

from order_service import Order, OrderService
from payment import ApplePayPayment, CreditCardPayment, FakePayment, PayPalPayment
from tightly_coupled_example import (
    Order as TightlyCoupledOrder,
    TightlyCoupledOrderService,
)

app = Flask(__name__)


@app.get("/")
def index():
    return render_template("index.html")


@app.get("/compare-checkout")
def compare_checkout():
    return render_template("compare_checkout.html")


@app.get("/without-di")
def without_di():
    return render_template("without_di.html")


@app.get("/with-di")
def with_di():
    return render_template("with_di.html")


@app.post("/checkout-without-di")
def checkout_without_di():
    data = request.get_json(force=True)
    requested_method = data.get("payment_method", "credit_card")

    if requested_method != "credit_card":
        return jsonify(
            {
                "ok": False,
                "message": (
                    "This version is tightly coupled to CreditCardPayment. "
                    "To use another provider, the service code must be changed."
                ),
            }
        ), 400

    try:
        total = float(data.get("total", 49.99))
        order_id = (data.get("order_id") or "A1001").strip()

        order = TightlyCoupledOrder(order_id, total)
        service = TightlyCoupledOrderService()
        result = service.checkout(order)

        return jsonify(
            {
                "ok": True,
                "message": result,
                "payment_class": service.payment_processor.__class__.__name__,
                "note": "CreditCardPayment was created inside TightlyCoupledOrderService.",
            }
        )

    except (ValueError, RuntimeError) as error:
        return jsonify({"ok": False, "message": str(error)}), 400


@app.post("/checkout")
def checkout():
    data = request.get_json(force=True)

    order_id = (data.get("order_id") or "A1001").strip()
    payment_method = data.get("payment_method", "credit_card")

    try:
        total = float(data.get("total", 49.99))

        if payment_method == "credit_card":
            card_last_four = (data.get("card_last_four") or "1234").strip()[-4:]
            payment = CreditCardPayment(card_last_four)
            payment_label = f"Credit card ending in {card_last_four}"

        elif payment_method == "paypal":
            email = (data.get("paypal_email") or "student@example.com").strip()
            payment = PayPalPayment(email)
            payment_label = f"PayPal ({email})"

        elif payment_method == "apple_pay":
            device_name = (data.get("device_name") or "iPhone").strip()
            payment = ApplePayPayment(device_name)
            payment_label = f"Apple Pay ({device_name})"

        elif payment_method == "fake":
            payment = FakePayment()
            payment_label = "FakePayment (test only)"

        else:
            return jsonify({"ok": False, "message": "Choose a valid payment method."}), 400

        order = Order(order_id, total)
        service = OrderService(payment)
        result = service.checkout(order)

        response = {
            "ok": True,
            "message": result,
            "payment_label": payment_label,
            "injected_class": payment.__class__.__name__,
            "total": total,
        }

        if isinstance(payment, FakePayment):
            response["test_detail"] = (
                f"FakePayment recorded ${payment.amounts_paid[-1]:.2f}."
            )

        return jsonify(response)

    except (ValueError, RuntimeError) as error:
        return jsonify({"ok": False, "message": str(error)}), 400


if __name__ == "__main__":
    app.run(debug=True)
