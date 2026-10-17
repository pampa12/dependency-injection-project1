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
- `ui.py` - simple desktop UI
- `web_app.py` - website-style checkout demo
- `templates/index.html` - checkout page
- `static/style.css` - website styling
- `static/app.js` - checkout interactions
- `tests/` - contains a unit test

## Run the website checkout demo

Install Flask:

```bash
python -m pip install -r requirements.txt
```

Start the website:

```bash
python web_app.py
```

Then open:

```text
http://127.0.0.1:5000
```

The checkout looks like a real online-store checkout and lets you switch between:

- Credit Card
- PayPal
- FakePayment

Behind the screen, the selected payment object is created and injected into the same `OrderService`.

## Run the console example

```bash
python main.py
```

## Run the desktop UI

```bash
python ui.py
```

## Run the test

```bash
python -m unittest discover -s tests
```
