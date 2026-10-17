const runButton = document.getElementById("run-tight-checkout");
const paypalButton = document.getElementById("try-paypal-tight");
const resultBox = document.getElementById("tight-result");
const logLines = document.getElementById("tight-log-lines");
const clearLog = document.getElementById("clear-tight-log");

function addLog(type, message) {
    const line = document.createElement("div");
    line.innerHTML = "<span>" + type + "</span>" + message;
    logLines.appendChild(line);
    logLines.scrollTop = logLines.scrollHeight;
}

async function runTightCheckout(method) {
    const response = await fetch("/checkout-without-di", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            order_id: "A1001",
            total: 49.99,
            payment_method: method
        })
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
        throw new Error(data.message || "Checkout failed.");
    }

    return data;
}

runButton.addEventListener("click", async () => {
    runButton.disabled = true;
    resultBox.textContent = "Running tightly coupled checkout...";

    addLog("CREATE", "TightlyCoupledOrderService created.");
    addLog("INSIDE", "Service creates CreditCardPayment() by itself.");
    addLog("CALL", "Checkout calls the fixed CreditCardPayment.");

    try {
        const data = await runTightCheckout("credit_card");
        resultBox.textContent =
            data.message + " " + data.note;
        resultBox.classList.add("pass");
        addLog("RESULT", data.message + " using " + data.payment_class + ".");
    } catch (error) {
        resultBox.textContent = error.message;
        resultBox.classList.remove("pass");
        addLog("ERROR", error.message);
    } finally {
        runButton.disabled = false;
    }
});

paypalButton.addEventListener("click", async () => {
    resultBox.textContent = "Trying to switch to PayPal...";
    resultBox.classList.remove("pass");

    addLog("TRY", "User asks for PayPal.");

    try {
        await runTightCheckout("paypal");
    } catch (error) {
        resultBox.textContent = error.message;
        addLog("BLOCKED", "Cannot switch provider without editing the service.");
    }
});

clearLog.addEventListener("click", () => {
    logLines.innerHTML = "";
    addLog("READY", "Log cleared.");
});
