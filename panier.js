/*let db;
function openDB(callback) {
    const dbRequest = indexedDB.open("CoffeeShopDB", 1);

    dbRequest.onsuccess = (event) => {
        console.log("Database opened successfully");
        db = event.target.result; // Set the global `db` variable
        if (callback) callback(); // Run the callback if provided
    };

    dbRequest.onerror = (event) => {
        console.error("Erreur lors de l'ouverture de la base de données:", event.target.error);
    };
}



document.addEventListener('DOMContentLoaded', () => {
    openDB(() => {
        loadProductsFromCart(); // Runs only after the database is ready
    });
});


// Open IndexedDB

function openDB() {
    const dbRequest = indexedDB.open("CoffeeShopDB", 1);

    dbRequest.onsuccess = (event) => {
        db = event.target.result;
    };

    dbRequest.onerror = (event) => {
        console.error("Erreur lors de l'ouverture de la base de données:", event.target.error);
    };
}

// Load products from the cart
function loadProductsFromCart() {
    const transaction = db.transaction("cart", "readonly");
    const store = transaction.objectStore("cart");
    const request = store.getAll();

    request.onsuccess = (event) => {
        console.log("Cart items retrieved:", event.target.result);
        const cartItems = event.target.result;
        displayCartItems(cartItems);
    };

    request.onerror = (event) => {
        console.error("Error loading cart items:", event.target.error);
    };
}

// Display cart items
function displayCartItems(cartItems) {
    const cartContainer = document.getElementById("cart-items");
    console.log("Displaying cart items:", cartItems); // Debugging log
    cartContainer.innerHTML = ""; // Clear previous content

    cartItems.forEach(item => {
        const row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = `
            <img src="${item.image_url}" alt="${item.name}" width="50">
            <span>${item.name}</span>
            <span>${item.price} dh</span>
            <span>Quantité: ${item.quantity}</span>
            <button onclick="removeFromCart(${item.id})">Supprimer</button>
        `;
        cartContainer.appendChild(row);
    });
}


// Remove an item from the cartq
function removeFromCart(itemId) {
    const transaction = db.transaction("cart", "readwrite");
    const store = transaction.objectStore("cart");
    store.delete(itemId);

    transaction.oncomplete = () => {
        loadProductsFromCart();
    };

    transaction.onerror = (event) => {
        console.error("Erreur lors de la suppression du produit:", event.target.error);
    };
}
*/