let products = [];

document.addEventListener('DOMContentLoaded', getProducts);

// Tache 1

function openDB() {
    const dbRequest = indexedDB.open("CoffeeShopDB", 1);
   
    dbRequest.onupgradeneeded = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("products")) {
    db.createObjectStore("products", { keyPath: "id" });
    }
    if (!db.objectStoreNames.contains("cart")) {
    db.createObjectStore("cart", { keyPath: "id" });
    }
    };
   
    return dbRequest;
}

async function getProducts() {
    try {
        const response = await fetch('https://fake-coffee-api.vercel.app/api');
        if (!response.ok) throw new Error("Erreur lors de la récupération des produits");
        products = await response.json();
        displayProducts(products);
        addProductsToDB(products);  // Tache 2 : Ajout des produits à IndexedDB
    }
    catch(error){
        console.error("Erreur lors de la récupération des produits:", error);
        loadProductsFromDB();  // Tache 5
    }
}

// Tache 3
function addProductsToDB(products) {
    const dbRequest = openDB();

    dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("products", "readwrite");  
        const store = transaction.objectStore("products");

        products.forEach(product => {
            store.put(product);  
        });
    };

    dbRequest.onerror = () => {
        console.error('Erreur lors de l\'ouverture de la base de données');
    };
}

// Tache 5
function loadProductsFromDB() {
    const dbRequest = openDB();  

    dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("products", "readonly");  
        const store = transaction.objectStore("products");

        const request = store.getAll();  

        getAllRequest.onsuccess = () => { 
            displayProducts(request.result);  
        };
    };
}

// Tache 6
function addToCart(productId) {
    const product_detail = products.find(p => p.id == productId);

    const cartItem = {
        id: productId,
        image_url: product_detail.image_url,
        name: product_detail.name,
        price: product_detail.price,
        quantity: 1
    };

    const dbRequest = openDB();
    dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("cart", "readwrite");
        const store = transaction.objectStore("cart");

        const getRequest = store.get(productId);
        getRequest.onsuccess = () => {
            const existingItem = getRequest.result;
            if (existingItem) {
                existingItem.quantity += 1;
                store.put(existingItem);
            } else {
                const cartItem = { ...product_detail, quantity: 1 };
                store.add(cartItem);
            }
        };
        getRequest.onerror = () => {
            const cartItem = { ...product_detail, quantity: 1 };
            store.put(cartItem);
          };
    };
}

function createProductCard(product) {
    const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image_url}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="product-info">
                <h4 class="price">${product.price} dh</h4>
                <p class="description">${product.description}</p>
                <button onclick="addToCart('${product.id}')" class="add-to-cart">+</button>
            </div>`
        ;
    return card;
  }

function displayProducts(products) {
    const productContainer = document.querySelector('.product-content');
    productContainer.innerHTML = '';

    products.forEach(product => {
        const productCard = createProductCard(product);
        productContainer.appendChild(productCard);
    });
}


//grid
document.getElementById('grid').addEventListener('click', () => {
    const productContainer = document.querySelector('.product-content');
    productContainer.style.display = 'grid';
    productContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';

    document.querySelectorAll('.product-card').forEach(card => {
        card.style.width = 'auto'; 
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.alignItems = 'center';
    });

    document.querySelectorAll('.product-card img').forEach(img => {
        img.style.width = '100%';
        img.style.height = '220px';
        img.style.background = '#d8d6d6';
    });
});

//list
document.getElementById('list').addEventListener('click', () => {
    const productContainer = document.querySelector('.product-content');
    productContainer.style.display = 'flex';
    productContainer.style.flexDirection = 'column';

    document.querySelectorAll('.product-card').forEach(card => {
        card.style.width = 'auto'; 
        card.style.display = 'flex';
        card.style.flexDirection = 'row';
        card.style.justifyContent = 'space-between';

    });

    document.querySelectorAll('.product-card img').forEach(img => {
        img.style.maxWidth = '220px';
    });

    document.querySelectorAll('.product-card button').forEach(btn => {
        btn.style.alignSelf = 'flex-end';
        
    });
});

document.getElementById('search-input').addEventListener('input', () => {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
});

getProducts();