// user.js — Profile page (provider-style) with theme toggle

document.addEventListener("DOMContentLoaded", () => {
  wireTheme();
  setupLogout(); // Set up logout immediately
  init();
});

// Separate logout setup function to ensure it always runs
function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent any default behavior
      
      console.log("Logout button clicked - clearing data and redirecting...");
      
      // Clear authentication data
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      sessionStorage.clear();
      
      // Redirect to login page
      window.location.href = "/login";
    });
  } else {
    console.warn("Logout button not found in DOM");
  }
}

async function init() {
  try {
    // 1) Profile
    const profile = await fetchJSON("/user_data");
    if (profile?.status === "success" && profile.data?.length) {
      renderProfile(profile.data[0]);
    } else {
      notify("Unable to load profile.", "error");
    }

    // 2) Claims
    const claims = await fetchJSON("/user_claims");
    if (claims?.status === "success") {
      renderClaims(claims.data || []);
    } else {
      renderClaims([]);
      notify("Unable to load claims.", "error");
    }

    // 3) Chatbot - Initialize after everything else loads
    if (typeof initChatbot === 'function') {
      initChatbot();
    }
    
  } catch (e) {
    console.error("Error in init():", e);
    notify("Server error. Please try again.", "error");
  }
}

/* -------- Theme toggle (top-right) -------- */
function wireTheme() {
  const btn = document.getElementById("themeToggle");
  const icon = document.getElementById("theme-icon");

  function setIcon(theme) {
    if (!icon) return;
    icon.src =
      theme === "light"
        ? "/static/assets/images/sun.png"
        : "/static/assets/images/brightness.png";
    icon.alt = theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode";
  }

  const saved = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
  setIcon(saved);

  btn?.addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setIcon(next);
  });
}

/* -------- API helper -------- */
async function fetchJSON(url, options = {}) {
  const res = await fetch(url, { credentials: "same-origin", ...options });
  return res.json();
}

/* -------- Helper Functions -------- */
function setText(id, text) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = text;
  }
}

function safe(value) {
  return value != null ? String(value) : '';
}

function qs(selector) {
  return document.querySelector(selector);
}

function notify(message, type) {
  console.log(`${type.toUpperCase()}: ${message}`);
  // You can replace this with your actual notification system
  // For example: showToast(message, type) or alert(message)
}

function formatAmount(amount) {
  if (!amount) return '-';
  return `$${parseFloat(amount).toFixed(2)}`;
}

function statusPill(status) {
  const statusClass = status ? status.toLowerCase().replace(/\s+/g, '-') : 'unknown';
  return `<span class="status-pill status-${statusClass}">${safe(status)}</span>`;
}

/* -------- Render: Profile -------- */
function renderProfile(user) {
  setText("fullName", `${safe(user.first_name)} ${safe(user.last_name)}`.trim());
  setText("patientId", `Patient ID: ${safe(user.patient_id)}`);

  setText("age", user.age ? `${safe(user.age)} years` : "-");
  setText("gender", safe(user.gender) || "-");
  setText("phone", safe(user.phone_no) || "-");
  setText("insuranceId", safe(user.insurance_id) || "-");
  setText("address", safe(user.address) || "-");

  const history = Array.isArray(user.medical_history) ? user.medical_history : [];
  setText("medicalHistory", history.length ? history.join(", ") : "-");

  // sidebar greeting
  setText("username", safe(user.first_name) || "User");
  setText("sidebarName", `${safe(user.first_name)} ${safe(user.last_name)}`.trim());
}

/* -------- Render: Claims -------- */
function renderClaims(list) {
  const tbody = qs("#claimsTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (!list.length) {
    tbody.innerHTML =
      `<tr><td colspan="4" style="text-align:center; color:#64748b; padding:18px 8px;">No claims found</td></tr>`;
    return;
  }

  list.forEach((c) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${safe(c.claim_id)}</td>
      <td>${safe(c.provider_id)}</td>
      <td class="amount">${formatAmount(c.amount)}</td>
      <td>${statusPill(c.status)}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Placeholder for chatbot initialization
function initChatbot() {
  console.log("Chatbot initialization - implement your chatbot logic here");
  // Add your chatbot initialization code here
}
