const USD_TO_INR = 82;
const products = [
    {
        id: 1,
        title: "Wireless Bluetooth Headphones",
        price: 59.99,
        rating: 4,
        image: "headphones.jpg",
        category: "electronics",
        description: "High-quality wireless headphones with 20hr battery life"
    },
    {
        id: 2,
        title: "Smart Watch with Fitness Tracker",
        price: 89.99,
        rating: 4,
        image: "Smart Watch.jpg",
        category: "electronics",
        description: "Track your fitness goals with this advanced smartwatch"
    },
    {
        id: 3,
        title: "Portable Bluetooth Speaker",
        price: 39.99,
        rating: 5,
        image: "speaker.jpg",
        category: "electronics",
        description: "Waterproof speaker with 15hr playtime"
    },
    {
        id: 4,
        title: "Laptop Backpack with USB Charging",
        price: 34.99,
        rating: 4,
        image: "backpack.jpg",
        category: "accessories",
        description: "Durable backpack with built-in USB charging port"
    },
    {
        id: 5,
        title: "Wireless Phone Charger Stand",
        price: 24.99,
        rating: 3,
        image: "charger.jpg",
        category: "electronics",
        description: "Fast-charging stand for Qi-enabled devices"
    },
    {
        id: 6,
        title: "4K Ultra HD Smart TV",
        price: 499.99,
        rating: 5,
        image: "tv.jpg",
        category: "electronics",
        description: "55-inch 4K TV with smart features"
    },
    {
        id: 7,
        title: "Gaming Keyboard and Mouse Combo",
        price: 49.99,
        rating: 4,
        image: "keyboard.jpg",
        category: "electronics",
        description: "RGB backlit gaming peripherals"
    },
    {
        id: 8,
        title: "Noise Cancelling Headphones",
        price: 199.99,
        rating: 5,
        image: "noise.jpg",
        category: "electronics",
        description: "Premium noise cancellation with 30hr battery"
    }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
const productGrid = document.getElementById('product-grid');
const cartLink = document.getElementById('cart-link');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const closeCart = document.querySelector('.close-cart');
const searchInput = document.querySelector('.nav-search input');
const categoryCards = document.querySelectorAll('.category-card');

function displayProducts(filter = 'all') {
    productGrid.innerHTML = '';
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category === filter);
    
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = '<p class="no-products">No products found in this category.</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        let stars = '';
        for (let i = 0; i < 5; i++) {
            stars += i < product.rating 
                ? '<i class="fas fa-star"></i>' 
                : '<i class="far fa-star"></i>';
        }
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <h3 class="product-title">${product.title}</h3>
            <div class="product-description">${product.description}</div>
            <div class="product-price">₹${(product.price * USD_TO_INR).toFixed(2)}</div>
            <div class="product-rating">${stars}</div>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCart();
    
    const button = e.target;
    button.textContent = '✓ Added!';
    button.style.backgroundColor = '#4CAF50';
    
    setTimeout(() => {
        button.textContent = 'Add to Cart';
        button.style.backgroundColor = '#ffd814';
    }, 1500);
}

function updateCart() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.classList.add('bubble');
    setTimeout(() => cartCount.classList.remove('bubble'), 300);
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty. Start shopping!</p>';
        cartTotal.textContent = '₹0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">₹${(item.price * USD_TO_INR).toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="decrease-quantity" data-id="${item.id}">-</button>
                    <input type="text" value="${item.quantity}" readonly>
                    <button class="increase-quantity" data-id="${item.id}">+</button>
                </div>
                <div class="remove-item" data-id="${item.id}">Remove</div>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = `₹${(total * USD_TO_INR).toFixed(2)}`;
    
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeItem);
    });
}

function increaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += 1;
        saveAndUpdateCart();
    }
}

function decreaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        saveAndUpdateCart();
    }
}

function removeItem(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    saveAndUpdateCart();
}

function saveAndUpdateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm.length > 2) {
        const filtered = products.filter(product => 
            product.title.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm)
        );
        
        renderFilteredProducts(filtered);
    } else if (searchTerm.length === 0) {
        displayProducts();
    }
});

function renderFilteredProducts(filteredProducts) {
    productGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = '<p class="no-products">No products match your search.</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        let stars = '';
        for (let i = 0; i < 5; i++) {
            stars += i < product.rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        }
        
   productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <h3 class="product-title">${product.title}</h3>
            <div class="product-description">${product.description}</div>
            <div class="product-price">₹${(product.price * USD_TO_INR).toFixed(2)}</div>
            <div class="product-rating">${stars}</div>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        productGrid.appendChild(productCard);
    });
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

categoryCards.forEach(card => {
    card.addEventListener('click', () => {
        const category = card.querySelector('p').textContent.toLowerCase();
        displayProducts(category === 'all' ? 'all' : category);
    });
});

cartLink.addEventListener('click', (e) => {
    e.preventDefault();
    cartModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; 
});

closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCart();
    
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});
