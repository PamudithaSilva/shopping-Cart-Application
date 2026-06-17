let categories = loadCategories();
let products = loadProducts();
let cart = [];
let selectedCategory = "All";

const categoryFilters = document.getElementById("categoryFilters");
const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const itemsTotal = document.getElementById("itemsTotal");
const grandTotal = document.getElementById("grandTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutSummary = document.getElementById("checkoutSummary");
const summaryContent = document.getElementById("summaryContent");
const searchInput = document.getElementById("searchInput");
const productCount = document.getElementById("productCount");
const cartBadge = document.getElementById("cartBadge");

function formatCurrency(value) {
  return `LKR ${value.toFixed(2)}`;
}

// -----------------------------------------------
// CATEGORIES
// -----------------------------------------------
function renderCategories() {
  categoryFilters.innerHTML = "";
  categories.forEach(category => {
    const btn = document.createElement("button");
    btn.className = `category-btn ${selectedCategory === category ? "active" : ""}`;
    btn.textContent = category;
    btn.addEventListener("click", () => {
      selectedCategory = category;
      renderCategories();
      renderProducts();
    });
    categoryFilters.appendChild(btn);
  });
}

// -----------------------------------------------
// PRODUCTS
// -----------------------------------------------
function renderProducts() {
  const searchText = searchInput.value.toLowerCase().trim();

  const filtered = products.filter(product => {
    const categoryMatch = selectedCategory === "All" || product.category === selectedCategory;
    const searchMatch =
      product.name.toLowerCase().includes(searchText) ||
      product.description.toLowerCase().includes(searchText);
    return categoryMatch && searchMatch;
  });

  productGrid.innerHTML = "";

  // Update count bar
  productCount.textContent = filtered.length === 0
    ? "No products found"
    : `Showing ${filtered.length} product${filtered.length !== 1 ? "s" : ""}${selectedCategory !== "All" ? " in " + selectedCategory : ""}`;

  if (filtered.length === 0) {
    productGrid.innerHTML = `
      <div class="empty-products">
        <div class="empty-icon">🔍</div>
        <p>No products found.</p>
        <span>Try a different category or search term.</span>
      </div>`;
    return;
  }

  filtered.forEach(product => {
    const inCart = cart.find(c => c.id === product.id);
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-img-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy"
          onerror="this.src='https://picsum.photos/seed/${product.id}/300/200'" />
        <span class="product-cat-tag">${product.category}</span>
      </div>
      <div class="product-body">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-footer">
          <span class="price">${formatCurrency(product.price)}</span>
          <button class="btn-add-cart ${inCart ? "in-cart" : ""}" data-id="${product.id}">
            ${inCart
              ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Added (${inCart.qty})`
              : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add to Cart`}
          </button>
        </div>
      </div>
    `;

    card.querySelector(".btn-add-cart").addEventListener("click", () => addToCart(product.id));
    productGrid.appendChild(card);
  });
}

// -----------------------------------------------
// CART
// -----------------------------------------------
function addToCart(productId) {
  const found = cart.find(item => item.id === productId);
  if (found) {
    found.qty += 1;
  } else {
    const product = products.find(p => p.id === productId);
    cart.push({ ...product, qty: 1 });
  }
  renderCart();
  renderProducts();
}

function changeQty(productId, change) {
  const item = cart.find(c => c.id === productId);
  if (!item) return;
  item.qty += change;
  if (item.qty <= 0) {
    cart = cart.filter(c => c.id !== productId);
  }
  renderCart();
  renderProducts();
}

function removeItem(productId) {
  cart = cart.filter(c => c.id !== productId);
  renderCart();
  renderProducts();
}

function renderCart() {
  cartItems.innerHTML = "";

  // Badge
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  if (totalQty > 0) {
    cartBadge.textContent = totalQty;
    cartBadge.classList.remove("hidden");
  } else {
    cartBadge.classList.add("hidden");
  }

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>Your cart is empty</p>
        <span>Add products to get started</span>
      </div>`;
  } else {
    cart.forEach(item => {
      const row = document.createElement("div");
      row.className = "cart-item";

      row.innerHTML = `
        <div class="cart-item-top">
          <span class="cart-item-name">${item.name}</span>
          <button class="cart-remove-btn" data-action="remove" title="Remove">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="cart-item-meta">
          <span class="cart-item-price">${formatCurrency(item.price)}</span>
          <span class="cart-item-sub">Subtotal: ${formatCurrency(item.price * item.qty)}</span>
        </div>
        <div class="cart-controls">
          <button class="qty-btn" data-action="minus">−</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn" data-action="plus">+</button>
        </div>
      `;

      row.querySelector('[data-action="minus"]').addEventListener("click", () => changeQty(item.id, -1));
      row.querySelector('[data-action="plus"]').addEventListener("click", () => changeQty(item.id, 1));
      row.querySelector('[data-action="remove"]').addEventListener("click", () => removeItem(item.id));

      cartItems.appendChild(row);
    });
  }

  updateTotals();
}

function updateTotals() {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = cart.length > 0 ? 250 : 0;
  const grand = total + delivery;

  itemsTotal.textContent = formatCurrency(total);
  document.getElementById("deliveryFee").textContent = formatCurrency(delivery);
  grandTotal.textContent = formatCurrency(grand);
}

// -----------------------------------------------
// CHECKOUT
// -----------------------------------------------
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    checkoutSummary.classList.add("hidden");
    return;
  }

  checkoutSummary.classList.remove("hidden");

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = 250;
  const grand = total + delivery;

  summaryContent.innerHTML = `
    <ul class="order-list">
      ${cart.map(item => `
        <li>
          <span>${item.name} × ${item.qty}</span>
          <span>${formatCurrency(item.price * item.qty)}</span>
        </li>`).join("")}
    </ul>
    <div class="order-totals">
      <div class="order-row"><span>Items Total</span><span>${formatCurrency(total)}</span></div>
      <div class="order-row"><span>Delivery Fee</span><span>${formatCurrency(delivery)}</span></div>
      <div class="order-row order-grand"><span>Grand Total</span><span>${formatCurrency(grand)}</span></div>
    </div>
  `;
});

searchInput.addEventListener("input", renderProducts);

renderCategories();
renderProducts();
renderCart();