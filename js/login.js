const loginButtons = document.querySelectorAll(".login-btn");
const loginMessage = document.getElementById("loginMessage");
const adminLoginForm = document.getElementById("adminLoginForm");

loginButtons.forEach(button => {
  button.addEventListener("click", () => {
    const provider = button.dataset.provider;
    loginMessage.textContent = `${provider} login selected. Connect this button to real OAuth in backend integration.`;
  });
});

adminLoginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("adminUsername").value.trim();
  const password = document.getElementById("adminPassword").value.trim();

  if (username === "admin" && password === "1234") {
    window.location.href = "admin.html";
  } else {
    loginMessage.textContent = "Invalid admin username or password.";
  }
});