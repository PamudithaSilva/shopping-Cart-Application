let categories = loadCategories();
let products = loadProducts();

const categoryForm = document.getElementById("categoryForm");
const categoryName = document.getElementById("categoryName");
const oldCategoryName = document.getElementById("oldCategoryName");
const cancelCategoryEdit = document.getElementById("cancelCategoryEdit");
const categoryTableBody = document.getElementById("categoryTableBody");

const productForm = document.getElementById("productForm");
const productId = document.getElementById("productId");
const productName = document.getElementById("productName");
const productCategory = document.getElementById("productCategory");
const productPrice = document.getElementById("productPrice");
const productDescription = document.getElementById("productDescription");
const productImage = document.getElementById("productImage");
const productTableBody = document.getElementById("productTableBody");

// -----------------------------------------------
// TOAST
// -----------------------------------------------
function showToast(msg, type) {
  const toast = document.getElementById("adminToast");
  toast.textContent = msg;
  toast.className = "admin-toast " + (type || "success");
  setTimeout(() => toast.classList.add("hidden"), 2500);
}

// -----------------------------------------------
// STATS
// -----------------------------------------------
function updateStats() {
  document.getElementById("statCategories").textContent = categories.filter(c => c !== "All").length;
  document.getElementById("statProducts").textContent = products.length;
}

// -----------------------------------------------
// RENDER CATEGORY OPTIONS
// -----------------------------------------------
function renderCategoryOptions() {
  productCategory.innerHTML = "";
  categories.filter(c => c !== "All").forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    productCategory.appendChild(option);
  });
}

// -----------------------------------------------
// RENDER CATEGORY TABLE
// -----------------------------------------------
function renderCategoryTable() {
  categoryTableBody.innerHTML = "";
  const cats = categories.filter(c => c !== "All");

  if (cats.length === 0) {
    categoryTableBody.innerHTML = `<tr><td colspan="3" class="empty-note" style="text-align:center;padding:20px;">No categories yet. Add one above.</td></tr>`;
    return;
  }

  cats.forEach((category, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="row-num">${index + 1}</span></td>
      <td><span class="cat-badge">${category}</span></td>
      <td>
        <div class="action-group">
          <button class="btn btn-warning btn-sm" data-edit-category="${category}">Edit</button>
          <button class="btn btn-danger btn-sm" data-delete-category="${category}">Delete</button>
        </div>
      </td>
    `;
    tr.querySelector(`[data-edit-category="${category}"]`).addEventListener("click", () => editCategory(category));
    tr.querySelector(`[data-delete-category="${category}"]`).addEventListener("click", () => deleteCategory(category));
    categoryTableBody.appendChild(tr);
  });
}

// -----------------------------------------------
// RENDER PRODUCTS TABLE
// -----------------------------------------------
function renderProductsTable() {
  productTableBody.innerHTML = "";

  if (products.length === 0) {
    productTableBody.innerHTML = `<tr><td colspan="5" class="empty-note" style="text-align:center;padding:20px;">No products yet. Add one above.</td></tr>`;
    return;
  }

  products.forEach(product => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="row-num">${product.id}</span></td>
      <td>
        <div class="prod-cell">
          <img src="${product.image}" alt="${product.name}" class="prod-thumb"
            onerror="this.src='https://picsum.photos/seed/${product.id}/40/40'" />
          <span class="prod-name">${product.name}</span>
        </div>
      </td>
      <td><span class="cat-badge">${product.category}</span></td>
      <td><span class="price-tag">LKR ${Number(product.price).toFixed(2)}</span></td>
      <td>
        <div class="action-group">
          <button class="btn btn-warning btn-sm" data-edit="${product.id}">Edit</button>
          <button class="btn btn-danger btn-sm" data-delete="${product.id}">Delete</button>
        </div>
      </td>
    `;
    tr.querySelector(`[data-edit="${product.id}"]`).addEventListener("click", () => editProduct(product.id));
    tr.querySelector(`[data-delete="${product.id}"]`).addEventListener("click", () => deleteProduct(product.id));
    productTableBody.appendChild(tr);
  });
}

// -----------------------------------------------
// CATEGORY FORM
// -----------------------------------------------
categoryForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const newCategory = categoryName.value.trim();
  const oldName = oldCategoryName.value.trim();
  if (!newCategory) return;

  if (!oldName) {
    if (categories.includes(newCategory)) { showToast("Category already exists.", "error"); return; }
    categories.push(newCategory);
    showToast("Category added!");
  } else {
    if (oldName !== newCategory && categories.includes(newCategory)) { showToast("Category already exists.", "error"); return; }
    categories = categories.map(c => (c === oldName ? newCategory : c));
    products = products.map(p => p.category === oldName ? { ...p, category: newCategory } : p);
    saveProducts(products);
    showToast("Category updated!");
  }

  saveCategories(categories);
  resetCategoryForm();
  renderCategoryOptions();
  renderCategoryTable();
  renderProductsTable();
  updateStats();
});

cancelCategoryEdit && cancelCategoryEdit.addEventListener("click", resetCategoryForm);

function editCategory(category) {
  oldCategoryName.value = category;
  categoryName.value = category;
  cancelCategoryEdit && cancelCategoryEdit.classList.remove("hidden");
  categoryName.focus();
}

function deleteCategory(category) {
  if (products.some(p => p.category === category)) {
    showToast("Cannot delete — products are assigned to this category.", "error");
    return;
  }
  categories = categories.filter(c => c !== category);
  saveCategories(categories);
  showToast("Category deleted.");
  renderCategoryOptions();
  renderCategoryTable();
  updateStats();
}

function resetCategoryForm() {
  categoryForm.reset();
  oldCategoryName.value = "";
  cancelCategoryEdit && cancelCategoryEdit.classList.add("hidden");
}

// -----------------------------------------------
// PRODUCT FORM
// -----------------------------------------------
productForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const data = {
    id: productId.value ? Number(productId.value) : Date.now(),
    name: productName.value.trim(),
    category: productCategory.value,
    price: Number(productPrice.value),
    description: productDescription.value.trim(),
    image: productImage.value.trim()
  };

  if (productId.value) {
    products = products.map(p => (p.id === data.id ? data : p));
    showToast("Product updated!");
  } else {
    products.push(data);
    showToast("Product added!");
  }

  saveProducts(products);
  productForm.reset();
  productId.value = "";
  renderProductsTable();
  updateStats();
});

function editProduct(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  productId.value = product.id;
  productName.value = product.name;
  productCategory.value = product.category;
  productPrice.value = product.price;
  productDescription.value = product.description;
  productImage.value = product.image;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteProduct(id) {
  products = products.filter(p => p.id !== id);
  saveProducts(products);
  showToast("Product deleted.");
  renderProductsTable();
  updateStats();
}

renderCategoryOptions();
renderCategoryTable();
renderProductsTable();
updateStats();