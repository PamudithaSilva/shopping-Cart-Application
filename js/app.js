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

function formatCurrency(value) {
  return `LKR ${value.toFixed(2)}`;
}

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

function renderProducts() {
  const searchText = searchInput.value.toLowerCase().trim();

  const filtered = products.filter(product => {
    const categoryMatch =
      selectedCategory === "All" || product.category === selectedCategory;

    const searchMatch =
      product.name.toLowerCase().includes(searchText) ||
      product.description.toLowerCase().includes(searchText);

    return categoryMatch && searchMatch;
  });

  productGrid.innerHTML = "";

  if (filtered.length === 0) {
    productGrid.innerHTML = `<p class="empty-note">No products found.</p>`;
    return;
  }

  filtered.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="price">${formatCurrency(product.price)}</div>
      <button class="btn btn-primary">Add to Cart</button>
    `;

    card.querySelector("button").addEventListener("click", () => addToCart(product.id));
    productGrid.appendChild(card);
  });
}

function addToCart(productId) {
  const found = cart.find(item => item.id === productId);

  if (found) {
    found.qty += 1;
  } else {
    const product = products.find(p => p.id === productId);
    cart.push({ ...product, qty: 1 });
  }

  renderCart();
}

function changeQty(productId, change) {
  const item = cart.find(c => c.id === productId);
  if (!item) return;

  item.qty += change;

  if (item.qty <= 0) {
    cart = cart.filter(c => c.id !== productId);
  }

  renderCart();
}

function removeItem(productId) {
  cart = cart.filter(c => c.id !== productId);
  renderCart();
}

function renderCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="empty-note">Your cart is empty.</p>`;
  } else {
    cart.forEach(item => {
      const row = document.createElement("div");
      row.className = "cart-item";

      row.innerHTML = `
        <h4>${item.name}</h4>
        <p>${formatCurrency(item.price)} x ${item.qty}</p>
        <p>Subtotal: ${formatCurrency(item.price * item.qty)}</p>
        <div class="cart-controls">
          <button class="btn btn-secondary" data-action="minus">-</button>
          <span>Qty: ${item.qty}</span>
          <button class="btn btn-secondary" data-action="plus">+</button>
          <button class="btn btn-danger" data-action="remove">Remove</button>
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

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  checkoutSummary.classList.remove("hidden");

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = 250;
  const grand = total + delivery;

  summaryContent.innerHTML = `
    <ul>
      ${cart.map(item => `<li>${item.name} - ${item.qty} x ${formatCurrency(item.price)}</li>`).join("")}
    </ul>
    <br>
    <p>Items Total: ${formatCurrency(total)}</p>
    <p>Delivery Fee: ${formatCurrency(delivery)}</p>
    <p><strong>Grand Total: ${formatCurrency(grand)}</strong></p>
  `;
});

searchInput.addEventListener("input", renderProducts);

renderCategories();
renderProducts();
renderCart();