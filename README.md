# Dependency Injection Demo

SE 340 - Software Architecture  
Team T6 - Bitew, Gessese, Guo

This project is a simple example of the Dependency Injection design pattern.

The program shows how the same `OrderService` can work with different payment methods. The payment method is passed into `OrderService` instead of being created inside the class.

## Files

- `payment.py` - contains the payment classes
- `order_service.py` - contains the order and checkout logic
- `tightly_coupled_example.py` - shows the version without Dependency Injection
- `main.py` - runs the example
- `tests/` - contains a unit test

## Run the program

```bash
python main.py
```

## Run the test

```bash
python -m unittest discover -s tests
```
