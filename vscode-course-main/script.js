// Productos de ejemplo
const PRODUCTS = [
  {
    id: 1,
    name: "Chaqueta Oversize",
    price: 999,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
    category: "Mujer",
    desc: "Chaqueta oversize de mezclilla, ideal para looks urbanos.",
    novedades: true,
    sale: false
  },
  {
    id: 2,
    name: "Pantalón Cargo",
    price: 799,
    image: "https://images.unsplash.com/photo-1469398715555-76331a00b81b?auto=format&fit=crop&w=400&q=80",
    category: "Hombre",
    desc: "Pantalón cargo con bolsillos laterales. Comodidad y estilo.",
    novedades: true,
    sale: true
  },
  {
    id: 3,
    name: "Sudadera Básica",
    price: 499,
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    category: "Mujer",
    desc: "Sudadera básica de algodón, colores a elegir.",
    novedades: false,
    sale: false
  },
  {
    id: 4,
    name: "Camisa Estampada",
    price: 659,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    category: "Hombre",
    desc: "Camisa con estampado tropical, perfecta para el verano.",
    novedades: false,
    sale: true
  },
  {
    id: 5,
    name: "Falda Plisada",
    price: 599,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    category: "Mujer",
    desc: "Falda plisada midi, elegante y fresca.",
    novedades: true,
    sale: false
  },
  {
    id: 6,
    name: "Playera Gráfica",
    price: 349,
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80",
    category: "Hombre",
    desc: "Playera de algodón con estampado exclusivo.",
    novedades: false,
    sale: false
  },
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Renderizar productos
function renderProducts(filter = "all") {
  const section = document.getElementById('products-section');
  section.innerHTML = "";
  let filtered = PRODUCTS;

  if (filter !== "all") {
    if (filter === "Novedades") filtered = PRODUCTS.filter(p => p.novedades);
    else if (filter === "Sale") filtered = PRODUCTS.filter(p => p.sale);
    else filtered = PRODUCTS.filter(p => p.category === filter);
  }

  if(filtered.length === 0) {
    section.innerHTML = "<div style='width:100%;text-align:center;padding:2.5rem;font-size:1.3rem;color:#999;'>No hay productos en esta categoría.</div>";
    return;
  }

  filtered.forEach(product => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" data-id="${product.id}" class="product-img"/>
      <h3>${product.name}</h3>
      <span>$${product.price} MXN</span>
      <button class="btn add-to-cart" data-id="${product.id}">Agregar al carrito</button>
    `;
    // Click para ver detalle
    div.querySelector('.product-img').addEventListener('click', () => showProductModal(product.id));
    // Click para agregar al carrito
    div.querySelector('.add-to-cart').addEventListener('click', () => addToCart(product.id));
    section.appendChild(div);
  });
}

// Carrito
function updateCartCount() {
  document.getElementById('cart-count').textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}
function addToCart(productId) {
  const prod = PRODUCTS.find(p => p.id === productId);
  const existing = cart.find(item => item.id === productId);
  if (existing) existing.qty += 1;
  else cart.push({ id: prod.id, qty: 1 });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}
function showCart() {
  document.getElementById('cart-modal').classList.add('active');
  renderCart();
}
function hideCart() {
  document.getElementById('cart-modal').classList.remove('active');
}
function renderCart() {
  const itemsDiv = document.getElementById('cart-items');
  itemsDiv.innerHTML = "";
  let total = 0;
  if (cart.length === 0) {
    itemsDiv.innerHTML = "<p style='color:#aaa;text-align:center;'>El carrito está vacío.</p>";
    document.getElementById('cart-total').innerHTML = "";
    return;
  }
  cart.forEach(item => {
    const prod = PRODUCTS.find(p => p.id === item.id);
    total += prod.price * item.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${prod.image}" alt="${prod.name}"/>
      <div class="cart-item-details">
        <div class="cart-item-title">${prod.name}</div>
        <div>Cantidad: ${item.qty}</div>
        <div>$${prod.price * item.qty} MXN</div>
      </div>
      <button class="cart-item-remove" data-id="${item.id}" title="Eliminar del carrito">&times;</button>
    `;
    div.querySelector('.cart-item-remove').addEventListener('click', () => removeFromCart(item.id));
    itemsDiv.appendChild(div);
  });
  document.getElementById('cart-total').innerHTML = `<strong>Total: $${total} MXN</strong>`;
}
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

// Modal de producto
function showProductModal(productId) {
  const prod = PRODUCTS.find(p => p.id === productId);
  const modal = document.getElementById('product-modal');
  const content = document.getElementById('product-modal-content');
  content.innerHTML = `
    <img src="${prod.image}" alt="${prod.name}"/>
    <h3>${prod.name}</h3>
    <p>${prod.desc}</p>
    <div><strong>$${prod.price} MXN</strong></div>
    <button class="btn" id="modal-add-cart">Agregar al carrito</button>
    <button class="btn" id="modal-close" style="background:#eee; color:#111; margin-top: 1rem;">Cerrar</button>
  `;
  content.querySelector("#modal-add-cart").onclick = () => {
    addToCart(prod.id);
    modal.classList.remove('active');
  };
  content.querySelector("#modal-close").onclick = () => modal.classList.remove('active');
  modal.classList.add('active');
}

// Filtros y navegación
document.getElementById('category-select').addEventListener('change', e => {
  renderProducts(e.target.value);
});
document.querySelectorAll('nav ul li a, .banner .btn').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('nav ul li a').forEach(a => a.classList.remove('active'));
    if(link.closest('nav')) link.classList.add('active');
    const cat = link.getAttribute('data-category');
    if (cat) {
      document.getElementById('category-select').value = cat;
      renderProducts(cat);
      window.scrollTo({top: document.getElementById('products-section').offsetTop - 60, behavior: 'smooth'});
    }
  });
});

// Carrito eventos
document.getElementById('cart-btn').onclick = showCart;
document.getElementById('cart-close').onclick = hideCart;
document.getElementById('cart-modal').onclick = e => { if (e.target === e.currentTarget) hideCart(); };
document.getElementById('checkout-btn').onclick = () => {
  alert('¡Gracias por tu compra! (Esto es una demo)');
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
};

// Modal producto: cerrar al hacer click fuera
document.getElementById('product-modal').onclick = e => { if (e.target === e.currentTarget) e.currentTarget.classList.remove('active'); };

// Menú hamburguesa
const navToggle = document.getElementById('nav-toggle');
const navUl = document.querySelector('nav ul');
navToggle.addEventListener('click', () => navUl.classList.toggle('active'));

// Inicializar
renderProducts();
updateCartCount();