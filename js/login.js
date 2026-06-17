// -----------------------------------------------
// DEMO ACCOUNTS (no backend needed)
// -----------------------------------------------
const users = [
  { username: "user",  password: "1234", role: "user"  },
  { username: "john",  password: "john123", role: "user"  },
  { username: "admin", password: "1234", role: "admin" }
];

const loginMessage = document.getElementById("loginMessage");

function showMessage(text, color) {
  loginMessage.textContent = text;
  loginMessage.style.color = color || "#153b6d";
}

// -----------------------------------------------
// TAB SWITCHER
// -----------------------------------------------
document.querySelectorAll(".auth-tab").forEach(function (tab) {
  tab.addEventListener("click", function () {
    document.querySelectorAll(".auth-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.add("hidden"));

    this.classList.add("active");
    document.getElementById("tab-" + this.dataset.tab).classList.remove("hidden");
    loginMessage.textContent = "";
  });
});

// -----------------------------------------------
// USER LOGIN
// -----------------------------------------------
document.getElementById("userLoginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("userUsername").value.trim();
  const password = document.getElementById("userPassword").value.trim();

  const match = users.find(u => u.username === username && u.password === password && u.role === "user");

  if (match) {
    showMessage("Login successful! Welcome, " + username + ". Redirecting...", "green");
    setTimeout(() => { window.location.href = "index.html"; }, 900);
  } else {
    showMessage("Incorrect username or password.", "red");
  }
});

// -----------------------------------------------
// ADMIN LOGIN
// -----------------------------------------------
document.getElementById("adminLoginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("adminUsername").value.trim();
  const password = document.getElementById("adminPassword").value.trim();

  const match = users.find(u => u.username === username && u.password === password && u.role === "admin");

  if (match) {
    showMessage("Admin login successful! Redirecting...", "green");
    setTimeout(() => { window.location.href = "admin.html"; }, 900);
  } else {
    showMessage("Invalid admin credentials.", "red");
  }
});

// -----------------------------------------------
// PASSWORD SHOW / HIDE
// -----------------------------------------------
function togglePw(inputId, btn) {
  const input = document.getElementById(inputId);
  const isHidden = input.type === "password";
  input.type = isHidden ? "text" : "password";

  btn.querySelector("svg").innerHTML = isHidden
    ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
       <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
       <line x1="1" y1="1" x2="23" y2="23"/>`
    : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
       <circle cx="12" cy="12" r="3"/>`;
}

// -----------------------------------------------
// SIMULATED SOCIAL LOGIN
// -----------------------------------------------
function socialLogin(provider) {
  showMessage(provider + " Login clicked. Add your " + provider + " App ID to activate.", "#2563eb");
}

// -----------------------------------------------
// PASSKEY (WebAuthn)
// -----------------------------------------------
async function passkeyLogin() {
  if (!window.PublicKeyCredential) {
    showMessage("Passkey not supported in this browser.", "red");
    return;
  }

  try {
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        rp: { name: "Shopping Cart App", id: window.location.hostname },
        user: {
          id: crypto.getRandomValues(new Uint8Array(16)),
          name: "user@shoppingcart.lk",
          displayName: "Shopping Cart User"
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" },
          { alg: -257, type: "public-key" }
        ],
        authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" },
        timeout: 60000,
        attestation: "none"
      }
    });

    if (credential) {
      showMessage("Passkey login successful! Redirecting...", "green");
      setTimeout(() => { window.location.href = "index.html"; }, 900);
    }
  } catch (err) {
    if (err.name === "NotAllowedError") {
      showMessage("Passkey setup was cancelled.", "red");
    } else {
      showMessage("Passkey error: " + err.message, "red");
    }
  }
}