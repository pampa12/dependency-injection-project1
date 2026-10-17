const runButton = document.getElementById("run-tight-checkout");
const paypalButton = document.getElementById("try-paypal-tight");
const resultBox = document.getElementById("tight-result");
const logLines = document.getElementById("tight-log-lines");
const clearLog = document.getElementById("clear-tight-log");

function addLog(message) {
    const line = document.createElement("div");
    line.textContent = message;
    logLines.appendChild(line);
    logLines.scrollTop = logLines.scrollHeight;
}

async function runRequest(method) {
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
    runButton.textContent = "Processing...";
    resultBox.className = "result-box";

    addLog("Created TightlyCoupledOrderService.");
    addLog("The service created CreditCardPayment() internally.");
    addLog("Calling checkout().");

    try {
        const data = await runRequest("credit_card");
        resultBox.textContent = data.message + " " + data.note;
        resultBox.className = "result-box success";
        addLog("Completed with " + data.payment_class + ".");
    } catch (error) {
        resultBox.textContent = error.message;
        resultBox.className = "result-box error";
        addLog("Error: " + error.message);
    } finally {
        runButton.disabled = false;
        runButton.textContent = "Pay $49.99";
    }
});

paypalButton.addEventListener("click", async () => {
    resultBox.textContent = "Trying PayPal...";
    resultBox.className = "result-box";
    addLog("Tried to switch to PayPal.");

    try {
        await runRequest("paypal");
    } catch (error) {
        resultBox.textContent = error.message;
        resultBox.className = "result-box error";
        addLog("Blocked: payment type is hard-coded in the service.");
    }
});

clearLog.addEventListener("click", () => {
    logLines.innerHTML = "<div>Ready.</div>";
});
