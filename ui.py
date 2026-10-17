import tkinter as tk
from tkinter import messagebox, ttk

from order_service import Order, OrderService
from payment import CreditCardPayment, FakePayment, PayPalPayment


def process_order():
    order_id = order_id_entry.get().strip() or "A1001"

    try:
        total = float(total_entry.get())
    except ValueError:
        messagebox.showerror("Invalid total", "Enter a valid order total.")
        return

    payment_method = payment_var.get()

    if payment_method == "Credit Card":
        payment = CreditCardPayment(card_entry.get().strip() or "1234")
    elif payment_method == "PayPal":
        payment = PayPalPayment(email_entry.get().strip() or "student@example.com")
    else:
        payment = FakePayment()

    try:
        order = Order(order_id, total)
        service = OrderService(payment)
        result = service.checkout(order)

        if payment_method == "FakePayment":
            detail = f"Fake payment recorded: ${payment.amounts_paid[-1]:.2f}"
        else:
            detail = f"Payment method: {payment_method}"

        result_label.config(
            text=f"{result}\n{detail}\n\nSame OrderService, different payment method."
        )
    except (ValueError, RuntimeError) as error:
        messagebox.showerror("Checkout error", str(error))


root = tk.Tk()
root.title("Dependency Injection Checkout Demo")
root.geometry("520x520")
root.resizable(False, False)

title = tk.Label(
    root,
    text="Dependency Injection Checkout Demo",
    font=("Arial", 18, "bold"),
)
title.pack(pady=(20, 5))

subtitle = tk.Label(
    root,
    text="Same OrderService, different payment method",
    font=("Arial", 11),
)
subtitle.pack(pady=(0, 20))

form = tk.Frame(root)
form.pack(padx=30, fill="x")

tk.Label(form, text="Order ID").grid(row=0, column=0, sticky="w", pady=6)
order_id_entry = tk.Entry(form, width=30)
order_id_entry.insert(0, "A1001")
order_id_entry.grid(row=0, column=1, pady=6)

tk.Label(form, text="Order Total").grid(row=1, column=0, sticky="w", pady=6)
total_entry = tk.Entry(form, width=30)
total_entry.insert(0, "49.99")
total_entry.grid(row=1, column=1, pady=6)

tk.Label(form, text="Payment Method").grid(row=2, column=0, sticky="w", pady=6)
payment_var = tk.StringVar(value="Credit Card")
payment_box = ttk.Combobox(
    form,
    textvariable=payment_var,
    values=["Credit Card", "PayPal", "FakePayment"],
    state="readonly",
    width=27,
)
payment_box.grid(row=2, column=1, pady=6)

tk.Label(form, text="Card Last 4").grid(row=3, column=0, sticky="w", pady=6)
card_entry = tk.Entry(form, width=30)
card_entry.insert(0, "1234")
card_entry.grid(row=3, column=1, pady=6)

tk.Label(form, text="PayPal Email").grid(row=4, column=0, sticky="w", pady=6)
email_entry = tk.Entry(form, width=30)
email_entry.insert(0, "pampa@example.com")
email_entry.grid(row=4, column=1, pady=6)

process_button = tk.Button(
    root,
    text="Process Order",
    command=process_order,
    font=("Arial", 11, "bold"),
    width=20,
)
process_button.pack(pady=20)

result_frame = tk.LabelFrame(root, text="Result", padx=15, pady=15)
result_frame.pack(padx=30, fill="both", expand=True, pady=(0, 25))

result_label = tk.Label(
    result_frame,
    text="Choose a payment method and process the order.",
    justify="left",
    anchor="nw",
    font=("Arial", 10),
)
result_label.pack(fill="both", expand=True)

root.mainloop()
