const paymentOptions = document.querySelectorAll(".payment-option");
const creditFields = document.getElementById("credit-fields");
const paypalFields = document.getElementById("paypal-fields");
const orderButton = document.getElementById("place-order");
const overlay = document.getElementById("success-overlay");
const successMessage = document.getElementById("success-message");
const injectedClass = document.getElementById("injected-class");
const tryAgain = document.getElementById("try-again");

const selectedDependency = document.getElementById("selected-dependency");
const dependencyName = document.getElementById("dependency-name");
const injectionCode = document.getElementById("injection-code");
const diExplanation = document.getElementById("di-explanation");

const dependencyDetails = {
    credit_card: {
        className: "CreditCardPayment",
        code: 'payment = CreditCardPayment("1234")\nservice = OrderService(payment)\nservice.checkout(order)',
        explanation: "CreditCardPayment is created outside OrderService and passed into its constructor."
    },
    paypal: {
        className: "PayPalPayment",
        code: 'payment = PayPalPayment("pampa@example.com")\nservice = OrderService(payment)\nservice.checkout(order)',
        explanation: "PayPalPayment is injected instead. OrderService does not need to be rewritten."
    },
    fake: {
        className: "FakePayment",
        code: 'payment = FakePayment()\nservice = OrderService(payment)\nservice.checkout(order)',
        explanation: "FakePayment is injected for testing, so checkout can be tested without a real payment provider."
    }
};

function selectedMethod() {
    return document.querySelector('input[name="payment"]:checked').value;
}

function updateDependencyPanel(method) {
    const details = dependencyDetails[method];

    selectedDependency.textContent = details.className;
    dependencyName.textContent = details.className;
    injectionCode.textContent = details.code;
    diExplanation.textContent = details.explanation;
}

function updatePaymentUI() {
    const method = selectedMethod();

    paymentOptions.forEach(option => {
        const radio = option.querySelector("input");
        option.classList.toggle("selected", radio.checked);
    });

    creditFields.classList.toggle("hidden", method !== "credit_card");
    paypalFields.classList.toggle("hidden", method !== "paypal");

    updateDependencyPanel(method);
}

paymentOptions.forEach(option => {
    option.addEventListener("click", () => {
        option.querySelector("input").checked = true;
        updatePaymentUI();
    });
});

orderButton.addEventListener("click", async () => {
    const method = selectedMethod();
    const cardNumber = document.getElementById("card-number").value.replace(/\D/g, "");
    const paypalEmail = document.getElementById("paypal-email").value.trim();

    const payload = {
        order_id: "A1001",
        total: 49.99,
        payment_method: method,
        card_last_four: cardNumber.slice(-4) || "1234",
        paypal_email: paypalEmail || "student@example.com",
    };

    orderButton.disabled = true;
    orderButton.firstElementChild.textContent = "Processing...";

    try {
        const response = await fetch("/checkout", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
            throw new Error(data.message || "Checkout failed.");
        }

        successMessage.textContent =
            data.message +
            (data.test_detail ? " " + data.test_detail : "");

        injectedClass.textContent = data.injected_class;
        overlay.classList.remove("hidden");
    } catch (error) {
        alert(error.message);
    } finally {
        orderButton.disabled = false;
        orderButton.firstElementChild.textContent = "Pay $49.99";
    }
});

tryAgain.addEventListener("click", () => {
    overlay.classList.add("hidden");
});

overlay.addEventListener("click", event => {
    if (event.target === overlay) {
        overlay.classList.add("hidden");
    }
});

updatePaymentUI();
