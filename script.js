let products = [];

document.addEventListener('DOMContentLoaded', getProducts);

//tache 1

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
   

function getProducts() {
    fetch('https://fake-coffee-api.vercel.app/api')
        .then(response => response.json())
        .then(data => {
            products = data;
            displayProducts(products);
        })
        .catch(error => console.error('Erreur lors de la récupération des produits:', error));
}

function displayProducts(products) {
    const productContainer = document.querySelector('.product-content');
    productContainer.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image_url}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="product-info">
                <h4 class="price">${product.price} dh</h4>
                <p class="description">${product.description}</p>
                <button class="add-to-cart">+</button>
            </div>`
        ;
        productContainer.appendChild(card);
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