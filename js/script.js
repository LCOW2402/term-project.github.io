document.addEventListener("DOMContentLoaded", function () {
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            const productList = document.getElementById('product-list');
            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');
                productDiv.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <h3>${product.name}</h3>
                    <p>Price: $${product.price.toFixed(2)}</p>
                    <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')">Add to Cart</button>
                `;
                productList.appendChild(productDiv);
            });
        });

    // Load cart from local storage
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        updateCart();
    }

    // Add event listeners for buttons
    document.getElementById('clear-cart').addEventListener('click', clearCart);
    document.getElementById('checkout').addEventListener('click', checkout);
});

let cart = [];
function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let totalPrice = 0;
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <h4>${item.name}</h4>
            <p>Price: $${item.price.toFixed(2)}</p>
            <div class="cart-item-controls">
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
        totalPrice += item.price * item.quantity;
    });
    document.getElementById('total-price').textContent = totalPrice.toFixed(2);
    localStorage.setItem('cart', JSON.stringify(cart));
}

function changeQuantity(id, delta) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== id);
        }
        updateCart();
    }
}

function clearCart() {
    cart = [];
    updateCart();
    localStorage.removeItem('cart'); // Clear cart from local storage
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty. Add items to the cart before checking out.");
        return;
    }

    // Clear cart and update UI
    clearCart();

    // Display success message
    alert("Thank you for your purchase! Your order has been placed successfully.");
}
