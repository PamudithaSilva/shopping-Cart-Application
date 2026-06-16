let categories = loadCategories();
let products = loadProducts();

const categoryForm = document.getElementById("categoryForm");
const categoryName = document.getElementById("categoryName");
const categoryAdminList = document.getElementById("categoryAdminList");

const productForm = document.getElementById("productForm");
const productId = document.getElementById("productId");
const productName = document.getElementById("productName");
const productCategory = document.getElementById("productCategory");
const productPrice = document.getElementById("productPrice");
const productDescription = document.getElementById("productDescription");
const productImage = document.getElementById("productImage");
const productTableBody = document.getElementById("productTableBody");

function renderCategoryOptions() {
  productCategory.innerHTML = "";

  categories
    .filter(c => c !== "All")
    .forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      productCategory.appendChild(option);
    });
}

function renderCategoryAdminList() {
  categoryAdminList.innerHTML = "";

  categories
    .filter(c => c !== "All")
    .forEach(category => {
      const li = document.createElement("li");
      li.textContent = category;
      categoryAdminList.appendChild(li);
    });
}

function renderProductsTable() {
  productTableBody.innerHTML = "";

  products.forEach(product => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>LKR ${Number(product.price).toFixed(2)}</td>
      <td>
        <div class="action-group">
          <button class="btn btn-warning" data-edit="${product.id}">Edit</button>
          <button class="btn btn-danger" data-delete="${product.id}">Delete</button>
        </div>
      </td>
    `;

    tr.querySelector(`[data-edit="${product.id}"]`).addEventListener("click", () => {
      editProduct(product.id);
    });

    tr.querySelector(`[data-delete="${product.id}"]`).addEventListener("click", () => {
      deleteProduct(product.id);
    });

    productTableBody.appendChild(tr);
  });
}

categoryForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const newCategory = categoryName.value.trim();
  if (!newCategory) return;

  if (categories.includes(newCategory)) {
    alert("Category already exists.");
    return;
  }

  categories.push(newCategory);
  saveCategories(categories);
  categoryName.value = "";

  renderCategoryOptions();
  renderCategoryAdminList();
});

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
  } else {
    products.push(data);
  }

  saveProducts(products);
  productForm.reset();
  productId.value = "";

  renderProductsTable();
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
}

function deleteProduct(id) {
  products = products.filter(p => p.id !== id);
  saveProducts(products);
  renderProductsTable();
}

renderCategoryOptions();
renderCategoryAdminList();
renderProductsTable();