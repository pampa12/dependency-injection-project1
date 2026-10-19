const cart = {};

const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout-button");

document.querySelectorAll(".product-card").forEach(card => {
    const button = card.querySelector(".add-button");

    button.addEventListener("click", () => {
        const name = card.dataset.name;
        const price = Number(card.dataset.price);

        if (!cart[name]) {
            cart[name] = {
                name,
                price,
                quantity: 0
            };
        }

        cart[name].quantity += 1;
        renderCart();
    });
});

function renderCart() {
    const items = Object.values(cart).filter(item => item.quantity > 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    cartCount.textContent = count;
    cartTotal.textContent = "$" + total.toFixed(2);

    if (items.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        checkoutButton.disabled = true;
        return;
    }

    cartItems.innerHTML = "";

    items.forEach(item => {
        const row = document.createElement("div");
        row.className = "cart-row";
        row.innerHTML =
            "<div><strong>" + item.name + "</strong><span>Qty " + item.quantity + "</span></div>" +
            "<strong>$" + (item.price * item.quantity).toFixed(2) + "</strong>";
        cartItems.appendChild(row);
    });

    checkoutButton.disabled = false;
}

checkoutButton.addEventListener("click", () => {
    const items = Object.values(cart).filter(item => item.quantity > 0);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    localStorage.setItem("di_demo_cart", JSON.stringify({
        items,
        total
    }));

    window.location.href = "/compare-checkout";
});
