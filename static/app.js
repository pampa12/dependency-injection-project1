const methodTabs = document.querySelectorAll(".method-tab");
const creditFields = document.getElementById("credit-fields");
const paypalFields = document.getElementById("paypal-fields");
const appleFields = document.getElementById("apple-fields");
const fakeFields = document.getElementById("fake-fields");

const runButton = document.getElementById("run-checkout");
const resultBox = document.getElementById("run-result");
const liveDependency = document.getElementById("live-dependency");
const createLine = document.getElementById("create-line");
const liveCode = document.getElementById("live-code");
const logLines = document.getElementById("log-lines");
const clearLog = document.getElementById("clear-log");

let currentMethod = "credit_card";

const methods = {
    credit_card: {
        className: "CreditCardPayment",
        create: 'CreditCardPayment("1234")',
        payload: {
            payment_method: "credit_card",
            card_last_four: "1234"
        }
    },
    paypal: {
        className: "PayPalPayment",
        create: 'PayPalPayment("pampa@example.com")',
        payload: {
            payment_method: "paypal",
            paypal_email: "pampa@example.com"
        }
    },
    apple_pay: {
        className: "ApplePayPayment",
        create: 'ApplePayPayment("iPhone")',
        payload: {
            payment_method: "apple_pay",
            device_name: "iPhone"
        }
    },
    fake: {
        className: "FakePayment",
        create: "FakePayment()",
        payload: {
            payment_method: "fake"
        }
    }
};

function addLog(message) {
    const line = document.createElement("div");
    line.textContent = message;
    logLines.appendChild(line);
    logLines.scrollTop = logLines.scrollHeight;
}

function showFields(method) {
    creditFields.classList.toggle("hidden", method !== "credit_card");
    paypalFields.classList.toggle("hidden", method !== "paypal");
    appleFields.classList.toggle("hidden", method !== "apple_pay");
    fakeFields.classList.toggle("hidden", method !== "fake");
}

function selectMethod(method) {
    currentMethod = method;
    const info = methods[method];

    methodTabs.forEach(tab => {
        tab.classList.toggle("active", tab.dataset.method === method);
    });

    showFields(method);

    liveDependency.textContent = info.className;
    createLine.textContent = info.create;
    liveCode.textContent =
        "payment = " + info.create + "\n" +
        "service = OrderService(payment)\n" +
        "service.checkout(order)";

    resultBox.textContent = "Ready.";
    resultBox.className = "result-box";

    addLog("Selected " + info.className + ".");
}

async function runCheckout() {
    const info = methods[currentMethod];

    const payload = {
        order_id: "A1001",
        total: 49.99,
        ...info.payload
    };

    runButton.disabled = true;
    runButton.textContent = "Processing...";

    addLog("Created " + info.className + " outside OrderService.");
    addLog("Injected with OrderService(payment).");
    addLog("Calling checkout().");

    try {
        const response = await fetch("/checkout", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
            throw new Error(data.message || "Checkout failed.");
        }

        resultBox.textContent =
            data.message +
            (data.test_detail ? " " + data.test_detail : "");

        resultBox.className = "result-box success";
        addLog("Completed with " + data.injected_class + ".");
    } catch (error) {
        resultBox.textContent = error.message;
        resultBox.className = "result-box error";
        addLog("Error: " + error.message);
    } finally {
        runButton.disabled = false;
        runButton.textContent = "Pay $49.99";
    }
}

methodTabs.forEach(tab => {
    tab.addEventListener("click", () => selectMethod(tab.dataset.method));
});

runButton.addEventListener("click", runCheckout);

clearLog.addEventListener("click", () => {
    logLines.innerHTML = "<div>Ready.</div>";
});

selectMethod("credit_card");
