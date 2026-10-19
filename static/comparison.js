const paymentSelect = document.getElementById("payment-select");
const withoutButton = document.getElementById("run-without");
const withButton = document.getElementById("run-with");
const withoutResult = document.getElementById("without-result");
const withResult = document.getElementById("with-result");
const withCode = document.getElementById("with-code");

function selectedMethod() {
    return paymentSelect.value;
}

function updateCode() {
    if (selectedMethod() === "paypal") {
        withCode.textContent =
            'payment = PayPalPayment("pampa@example.com")\n' +
            'service = OrderService(payment)';
    } else {
        withCode.textContent =
            'payment = CreditCardPayment("1234")\n' +
            'service = OrderService(payment)';
    }

    withoutResult.textContent = "Ready.";
    withoutResult.className = "simple-result";
    withResult.textContent = "Ready.";
    withResult.className = "simple-result";
}

async function postJson(url, body) {
    const response = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
        throw new Error(data.message || "Request failed.");
    }

    return data;
}

withoutButton.addEventListener("click", async () => {
    withoutResult.textContent = "Running...";

    try {
        const data = await postJson("/checkout-without-di", {
            order_id: "A1001",
            total: 49.99,
            payment_method: selectedMethod()
        });

        withoutResult.textContent =
            data.message + " Payment used: " + data.payment_class + ".";
        withoutResult.className = "simple-result success";
    } catch (error) {
        withoutResult.textContent = error.message;
        withoutResult.className = "simple-result error";
    }
});

withButton.addEventListener("click", async () => {
    withResult.textContent = "Running...";

    const method = selectedMethod();
    const body = {
        order_id: "A1001",
        total: 49.99,
        payment_method: method
    };

    if (method === "credit_card") {
        body.card_last_four = "1234";
    }

    if (method === "paypal") {
        body.paypal_email = "pampa@example.com";
    }

    try {
        const data = await postJson("/checkout", body);
        withResult.textContent =
            data.message + " Payment used: " + data.injected_class + ".";
        withResult.className = "simple-result success";
    } catch (error) {
        withResult.textContent = error.message;
        withResult.className = "simple-result error";
    }
});

paymentSelect.addEventListener("change", updateCode);
updateCode();
