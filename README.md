# Dependency Injection Demo

SE 340 - Software Architecture  
Team T6 - Bitew, Gessese, Guo

This project is a simple example of the Dependency Injection design pattern.

The program shows how the same `OrderService` can work with different payment methods. The payment method is passed into `OrderService` instead of being created inside the class.

## Files

- `payment.py` - contains the payment classes
- `order_service.py` - contains the order and checkout logic
- `tightly_coupled_example.py` - shows the version without Dependency Injection
- `main.py` - runs the console example
- `ui.py` - runs a simple checkout user interface for the presentation
- `tests/` - contains a unit test

## Run the console example

```bash
python main.py
```

## Run the UI demo

```bash
python ui.py
```

The UI lets you choose between:

- Credit Card
- PayPal
- FakePayment

The important part is that the same `OrderService` is used each time. Only the payment object that gets injected changes.

## Run the test

```bash
python -m unittest discover -s tests
```
