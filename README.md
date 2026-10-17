# Dependency Injection Demo

SE 340 - Software Architecture  
Team T6 - Bitew, Gessese, Guo

This project demonstrates the Dependency Injection design pattern with a simple order checkout system.

The main idea is that `OrderService` receives a payment object from the outside instead of creating a specific payment class inside itself.

## Final presentation demo

The final website now starts with a side-by-side comparison. Demo A shows the same checkout without Dependency Injection, and Demo B shows the improved version with Dependency Injection.

### Demo A - Without Dependency Injection

- Uses `TightlyCoupledOrderService`
- The service creates `CreditCardPayment()` inside itself
- Credit Card works
- Trying to switch to PayPal is blocked because the service is hard-coded
- Shows why tight coupling is a problem

### Demo B - With Dependency Injection

The DI walkthrough then shows the pattern step by step:

1. **The problem** - shows tight coupling when `OrderService` creates `CreditCardPayment` itself.
2. **Choose a dependency** - select Credit Card, PayPal, Apple Pay, or FakePayment.
3. **Inject it** - shows the selected object being passed into `OrderService(payment)`.
4. **Run checkout** - executes the same `OrderService` with the selected payment class.
5. **Test and extend** - uses `FakePayment` for testing and shows that `ApplePayPayment` can be added without changing `OrderService`.

A live system panel also shows the current object, injection path, code path, and event log during the presentation.

## Run the final website demo

Install the dependency:

```bash
python -m pip install -r requirements.txt
```

Start the Flask app:

```bash
python web_app.py
```

Open this address in a browser:

```text
http://127.0.0.1:5000
```

## Project files

- `payment.py` - CreditCardPayment, PayPalPayment, ApplePayPayment, and FakePayment
- `order_service.py` - Order and OrderService
- `tightly_coupled_example.py` - version without Dependency Injection
- `web_app.py` - Flask backend for the presentation demo
- `templates/index.html` - step-by-step demo page
- `static/style.css` - presentation demo styling
- `static/app.js` - interactive walkthrough and live execution
- `main.py` - console example
- `tests/` - unit test using FakePayment

## Run the console example

```bash
python main.py
```

## Run the tests

```bash
python -m unittest discover -s tests
```

## Key takeaway

The dependency changes, but `OrderService` does not.
