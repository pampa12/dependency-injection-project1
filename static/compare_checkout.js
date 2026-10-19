const saved = JSON.parse(localStorage.getItem("di_demo_cart") || '{"items":[],"total":0}');

const checkoutItems = document.getElementById("checkout-items");
const checkoutTotal = document.getElementById("checkout-total");
const paymentSelect = document.getElementById("compare-payment");
const withoutButton = document.getElementById("run-without-di");
const withButton = document.getElementById("run-with-di");
const withoutResult = document.getElementById("without-di-result");
const withResult = document.getElementById("with-di-result");
const withCode = document.getElementById("with-di-code");

function renderOrder() {
    if (!saved.items.length) {
        checkoutItems.innerHTML = "<p>No items found. Go back to the shop and add something first.</p>";
        checkoutTotal.textContent = "$0.00";
        withoutButton.disabled = true;
        withButton.disabled = true;
        return;
    }

    checkoutItems.innerHTML = "";

    saved.items.forEach(item => {
        const row = document.createElement("div");
        row.className = "checkout-item-row";
        row.innerHTML =
            "<div><strong>" + item.name + "</strong><span>Qty " + item.quantity + "</span></div>" +
            "<strong>$" + (item.price * item.quantity).toFixed(2) + "</strong>";
        checkoutItems.appendChild(row);
    });

    checkoutTotal.textContent = "$" + Number(saved.total).toFixed(2);
}

function updateCode() {
    if (paymentSelect.value === "paypal") {
        withCode.textContent =
            'payment = PayPalPayment("pampa@example.com")\n' +
            'service = OrderService(payment)';
    } else {
        withCode.textContent =
            'payment = CreditCardPayment("1234")\n' +
            'service = OrderService(payment)';
    }

    withoutResult.textContent = "Ready.";
    withoutResult.className = "compare-result";
    withResult.textContent = "Ready.";
    withResult.className = "compare-result";
}

async function postJson(url, body) {
    const response = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
        throw new Error(data.message || "Checkout failed.");
    }

    return data;
}

withoutButton.addEventListener("click", async () => {
    withoutResult.textContent = "Running...";

    try {
        const data = await postJson("/checkout-without-di", {
            order_id: "A1001",
            total: saved.total,
            payment_method: paymentSelect.value
        });

        withoutResult.textContent =
            data.message + " Used " + data.payment_class + ".";
        withoutResult.className = "compare-result success";
    } catch (error) {
        withoutResult.textContent = error.message;
        withoutResult.className = "compare-result error";
    }
});

withButton.addEventListener("click", async () => {
    withResult.textContent = "Running...";

    const method = paymentSelect.value;
    const body = {
        order_id: "A1001",
        total: saved.total,
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
            data.message + " Used " + data.injected_class + ".";
        withResult.className = "compare-result success";
    } catch (error) {
        withResult.textContent = error.message;
        withResult.className = "compare-result error";
    }
});

paymentSelect.addEventListener("change", updateCode);

renderOrder();
updateCode();
