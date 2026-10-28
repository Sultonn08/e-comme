const message = document.getElementById("account-message");
let csrfToken = "";
let siteContent = {};
const contentText = (key, fallback) => siteContent[key] ?? fallback;

async function loadSiteContent() {
  try {
    const response = await fetch("../api/content.php", { headers: { Accept: "application/json" } });
    const data = await response.json();
    if (!response.ok || !data.content || typeof data.content !== "object") {
      throw new Error(data.error || "Teks halaman akun tidak dapat dimuat.");
    }
    siteContent = data.content;
    document.querySelectorAll("[data-content]").forEach(element => {
      const value = siteContent[element.dataset.content];
      if (typeof value === "string") element.textContent = value;
    });
    const pageTitle = siteContent["account.page_title"];
    if (pageTitle) document.title = pageTitle;
  } catch (error) {
    console.warn("Teks akun database tidak tersedia; memakai teks bawaan halaman.", error);
  }
}

async function loadCsrfToken() {
  const response = await fetch("../api/auth.php?action=csrf", { headers: { Accept: "application/json" } });
  const data = await response.json();
  if (!response.ok || !data.csrfToken) throw new Error(data.error || "Tidak dapat memulai sesi akun.");
  csrfToken = data.csrfToken;
}

async function submitAuth(action, form) {
  message.textContent = "";
  const response = await fetch(`../api/auth.php?action=${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
    body: JSON.stringify(Object.fromEntries(new FormData(form)))
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Permintaan akun gagal.");
  window.location.reload();
}

async function sendLogout() {
  const response = await fetch("../api/auth.php?action=logout", {
    method: "POST",
    headers: { "X-CSRF-Token": csrfToken }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Tidak dapat keluar dari akun.");
  window.location.reload();
}

function showMessage(error) {
  message.textContent = error.message;
  message.classList.add("is-error");
}

async function initializeAccountPage() {
  try {
    await Promise.all([loadCsrfToken(), loadSiteContent()]);
    document.getElementById("login-form")?.addEventListener("submit", async event => {
      event.preventDefault();
      try { await submitAuth("login", event.currentTarget); } catch (error) { showMessage(error); }
    });
    document.getElementById("register-form")?.addEventListener("submit", async event => {
      event.preventDefault();
      try { await submitAuth("register", event.currentTarget); } catch (error) { showMessage(error); }
    });
    document.getElementById("logout")?.addEventListener("click", async () => {
      try { await sendLogout(); } catch (error) { showMessage(error); }
    });

    document.getElementById("show-login")?.addEventListener("click", () => setAccountForm("login"));
    document.getElementById("show-register")?.addEventListener("click", () => setAccountForm("register"));
  } catch (error) {
    showMessage(error);
  }
}

function setAccountForm(name) {
  const registering = name === "register";
  document.getElementById("login-form").hidden = registering;
  document.getElementById("register-form").hidden = !registering;
  document.getElementById("account-title").textContent = registering
    ? contentText("account.register_title", "Daftar akun")
    : contentText("account.login_title", "Masuk");
  document.getElementById("account-intro").textContent = registering
    ? contentText("account.register_intro", "Buat akun pelanggan untuk menggunakan toko.")
    : contentText("account.login_intro", "Masuk ke akun toko.");
  document.getElementById("show-login").setAttribute("aria-pressed", String(!registering));
  document.getElementById("show-register").setAttribute("aria-pressed", String(registering));
  message.textContent = "";
  message.classList.remove("is-error");
}

initializeAccountPage();
