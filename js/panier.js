document.addEventListener('DOMContentLoaded', loadProductsFromCart);

function openDB() {
    const dbRequest = indexedDB.open("CoffeeShopDB", 1);

    dbRequest.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("cart")) {
            db.createObjectStore("cart", { keyPath: "id" });
        }
    };

    return dbRequest;
}

function loadProductsFromCart() {
    const dbRequest = openDB();

    dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("cart", "readonly");
        const store = transaction.objectStore("cart");

        const request = store.getAll();
        request.onsuccess = () => {
            const cartItems = request.result;
            displayCartItems(cartItems);
        };
    };
}

function displayCartItems(cartItems) {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = ''; // Clear existing content
    let total = 0;

    cartItems.forEach(item => {
        const cartRow = createCartItemRow(item);
        cartContainer.appendChild(cartRow);
        total += item.price * item.quantity;
    });

    document.getElementById('cart-total').textContent = total.toFixed(2);
}

function createCartItemRow(product) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <div class="product-info">
                <img src="${product.image_url}" alt="${product.name}">
                <span>${product.name}</span>
            </div>
        </td>
        <td>
            <div class="quantity-controls">
                <button class="quantity-btn minus">-</button>
                <span class="quantity">${product.quantity}</span>
                <button class="quantity-btn plus">+</button>
            </div>
        </td>
        <td>${product.price} dh</td>
        <td>${(product.price * product.quantity).toFixed(2)} dh</td>
        <td>
            <button class="remove-item">Supprimer</button>
        </td>
    `;

    // Event listeners for quantity controls
    row.querySelector('.plus').addEventListener('click', () => {
        updateQuantity(product.id, product.quantity + 1);
    });

    row.querySelector('.minus').addEventListener('click', () => {
        if (product.quantity > 1) {
            updateQuantity(product.id, product.quantity - 1);
        }
    });

    // Event listener for removing item
    row.querySelector('.remove-item').addEventListener('click', () => {
        removeFromCart(product.id);
    });

    return row;
}

function updateQuantity(itemId, newQuantity) {
    const dbRequest = openDB();

    dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("cart", "readwrite");
        const store = transaction.objectStore("cart");

        const request = store.get(itemId);
        request.onsuccess = () => {
            const item = request.result;
            item.quantity = newQuantity;

            store.put(item);
            loadProductsFromCart(); // Refresh the cart view
        };
    };
}



function updateQuantity(itemId, newQuantity) {
    const dbRequest = openDB();

    dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("cart", "readwrite");
        const store = transaction.objectStore("cart");

        const request = store.get(itemId);
        request.onsuccess = () => {
            const item = request.result;
            item.quantity = newQuantity;

            store.put(item);
            loadProductsFromCart(); // Refresh the cart view
        };
    };
}

function removeFromCart(itemId) {
    const dbRequest = openDB();

    dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("cart", "readwrite");
        const store = transaction.objectStore("cart");

        store.delete(itemId);
        loadProductsFromCart(); // Refresh the cart view
    };
}
