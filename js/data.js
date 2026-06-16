const defaultCategories = [
  "All",
  "Vegetables",
  "Fruits",
  "Cakes",
  "Biscuits"
];

const defaultProducts = [
  {
    id: 1,
    name: "Carrot",
    category: "Vegetables",
    price: 180,
    description: "Fresh organic carrots.",
    image:  "assets/carrot.png"
  },
  {
    id: 2,
    name: "Tomato",
    category: "Vegetables",
    price: 220,
    description: "Ripe red tomatoes.",
    image: "assets/tomato.png"
  },
  {
    id: 3,
    name: "Apple",
    category: "Fruits",
    price: 320,
    description: "Sweet and crispy apples.",
    image: "assets/apple.png"
  },
  {
    id: 4,
    name: "Banana",
    category: "Fruits",
    price: 140,
    description: "Fresh yellow bananas.",
    image: "assets/banana.png"
  },
  {
    id: 5,
    name: "Chocolate Cake",
    category: "Cakes",
    price: 1800,
    description: "Rich chocolate cake.",
    image: "assets/chocolate_cake.png"
  },
  {
    id: 6,
    name: "Butter Biscuit",
    category: "Biscuits",
    price: 450,
    description: "Crunchy butter biscuits.",
    image: "assets/butter_biscuit.png"
  }
];

function loadCategories() {
  return JSON.parse(localStorage.getItem("sc_categories")) || defaultCategories;
}

function saveCategories(categories) {
  localStorage.setItem("sc_categories", JSON.stringify(categories));
}

function loadProducts() {
  return JSON.parse(localStorage.getItem("sc_products")) || defaultProducts;
}

function saveProducts(products) {
  localStorage.setItem("sc_products", JSON.stringify(products));
}