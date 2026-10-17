const stepTabs = document.querySelectorAll(".step-tab");
const panels = document.querySelectorAll(".step-panel");
const nextButtons = document.querySelectorAll(".next-button[data-next]");
const paymentChoices = document.querySelectorAll(".payment-choice");

const selectedClassLarge = document.getElementById("selected-class-large");
const stageDependency = document.getElementById("stage-dependency");
const constructorCode = document.getElementById("constructor-code");
const checkoutMethodName = document.getElementById("checkout-method-name");
const runCreate = document.getElementById("run-create");
const runResult = document.getElementById("run-result");

const liveDependency = document.getElementById("live-dependency");
const liveCode = document.getElementById("live-code");
const logLines = document.getElementById("log-lines");

const runCheckoutButton = document.getElementById("run-checkout");
const runFakeTestButton = document.getElementById("run-fake-test");
const fakeTestResult = document.getElementById("fake-test-result");
const useApplePayButton = document.getElementById("use-apple-pay");

const resetDemoButton = document.getElementById("reset-demo");
const restartButton = document.getElementById("restart-walkthrough");
const clearLogButton = document.getElementById("clear-log");

let currentStep = 1;
let currentMethod = "credit_card";

const methods = {
    credit_card: {
        label: "Credit Card",
        className: "CreditCardPayment",
        create: 'CreditCardPayment("1234")',
        payload: {
            payment_method: "credit_card",
            card_last_four: "1234"
        }
    },
    paypal: {
        label: "PayPal",
        className: "PayPalPayment",
        create: 'PayPalPayment("pampa@example.com")',
        payload: {
            payment_method: "paypal",
            paypal_email: "pampa@example.com"
        }
    },
    apple_pay: {
        label: "Apple Pay",
        className: "ApplePayPayment",
        create: 'ApplePayPayment("iPhone")',
        payload: {
            payment_method: "apple_pay",
            device_name: "iPhone"
        }
    },
    fake: {
        label: "FakePayment",
        className: "FakePayment",
        create: "FakePayment()",
        payload: {
            payment_method: "fake"
        }
    }
};

function addLog(type, message) {
    const line = document.createElement("div");
    line.innerHTML = "<span>" + type + "</span>" + message;
    logLines.appendChild(line);
    logLines.scrollTop = logLines.scrollHeight;
}

function codeFor(method) {
    const info = methods[method];
    return (
        "payment = " + info.create + "\n" +
        "service = OrderService(payment)\n" +
        "service.checkout(order)"
    );
}

function setStep(step) {
    currentStep = Number(step);

    stepTabs.forEach(tab => {
        tab.classList.toggle("active", Number(tab.dataset.step) === currentStep);
    });

    panels.forEach(panel => {
        panel.classList.toggle("active", Number(panel.dataset.panel) === currentStep);
    });

    const labels = {
        1: "Showing tight coupling problem.",
        2: "Choosing a dependency outside OrderService.",
        3: "Showing constructor injection.",
        4: "Ready to execute checkout.",
        5: "Showing testing and extension benefits."
    };

    addLog("STEP " + currentStep, labels[currentStep]);
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function setMethod(method, shouldLog = true) {
    currentMethod = method;
    const info = methods[method];

    paymentChoices.forEach(choice => {
        choice.classList.toggle("selected", choice.dataset.method === method);
    });

    selectedClassLarge.textContent = info.className;
    stageDependency.textContent = info.className;
    constructorCode.textContent =
        "payment = " + info.create + "\n" +
        "service = OrderService(payment)";

    checkoutMethodName.textContent = info.className;
    runCreate.textContent = info.className;
    runResult.textContent = "Waiting to run...";

    liveDependency.textContent = info.className;
    liveCode.textContent = codeFor(method);

    runCheckoutButton.textContent = "Run checkout with " + info.className;

    if (shouldLog) {
        addLog("SELECT", info.className + " chosen outside OrderService.");
    }
}

async function executeCheckout(method) {
    const info = methods[method];

    const payload = {
        order_id: "A1001",
        total: 49.99,
        ...info.payload
    };

    const response = await fetch("/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
        throw new Error(data.message || "Checkout failed.");
    }

    return data;
}

stepTabs.forEach(tab => {
    tab.addEventListener("click", () => setStep(tab.dataset.step));
});

nextButtons.forEach(button => {
    button.addEventListener("click", () => setStep(button.dataset.next));
});

paymentChoices.forEach(choice => {
    choice.addEventListener("click", () => setMethod(choice.dataset.method));
});

runCheckoutButton.addEventListener("click", async () => {
    const info = methods[currentMethod];

    runCheckoutButton.disabled = true;
    runCheckoutButton.textContent = "Running...";

    addLog("CREATE", info.className + " object created outside OrderService.");
    addLog("INJECT", info.className + " passed into OrderService(payment).");
    addLog("CALL", "OrderService calls payment_processor.pay(49.99).");

    try {
        const data = await executeCheckout(currentMethod);

        runResult.textContent = data.message;
        addLog("RESULT", data.message + " using " + data.injected_class + ".");
    } catch (error) {
        runResult.textContent = error.message;
        addLog("ERROR", error.message);
    } finally {
        runCheckoutButton.disabled = false;
        runCheckoutButton.textContent = "Run checkout with " + info.className;
    }
});

runFakeTestButton.addEventListener("click", async () => {
    fakeTestResult.textContent = "Running test...";
    fakeTestResult.classList.remove("pass");

    addLog("TEST", "Injecting FakePayment instead of a real provider.");

    try {
        const data = await executeCheckout("fake");
        fakeTestResult.textContent =
            "PASS — " + (data.test_detail || "FakePayment completed the test.");
        fakeTestResult.classList.add("pass");
        addLog("PASS", data.test_detail || "FakePayment test passed.");
    } catch (error) {
        fakeTestResult.textContent = "Test failed — " + error.message;
        addLog("ERROR", error.message);
    }
});

useApplePayButton.addEventListener("click", () => {
    setMethod("apple_pay");
    addLog("EXTEND", "ApplePayPayment added without changing OrderService.");
    setStep(4);
});

clearLogButton.addEventListener("click", () => {
    logLines.innerHTML = "";
    addLog("READY", "Log cleared.");
});

function resetDemo() {
    logLines.innerHTML = "";
    fakeTestResult.textContent = "Not run yet";
    fakeTestResult.classList.remove("pass");
    setMethod("credit_card", false);
    currentStep = 1;

    stepTabs.forEach(tab => {
        tab.classList.toggle("active", Number(tab.dataset.step) === 1);
    });

    panels.forEach(panel => {
        panel.classList.toggle("active", Number(panel.dataset.panel) === 1);
    });

    addLog("READY", "Demo reset with CreditCardPayment.");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

resetDemoButton.addEventListener("click", resetDemo);
restartButton.addEventListener("click", resetDemo);

setMethod("credit_card", false);
