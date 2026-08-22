// ==================================================
// CONFIG
// ==================================================

const API_URL = "https://admin-pg-git.natanzcity-official.workers.dev";

// ==================================================
// ELEMENTS
// ==================================================

const loginBox = document.getElementById("loginBox");

const panelBox = document.getElementById("panelBox");

const loginForm = document.getElementById("loginForm");

const passwordInput = document.getElementById("password");

const loginButton = document.getElementById("loginButton");

const loginMessage = document.getElementById("loginMessage");

const logoutButton = document.getElementById("logoutButton");

const imageInput = document.getElementById("imageInput");

const preview = document.getElementById("preview");

const previewImage = document.getElementById("previewImage");

const fileName = document.getElementById("fileName");

const uploadButton = document.getElementById("uploadButton");

const uploadMessage = document.getElementById("uploadMessage");

const worksGrid = document.getElementById("worksGrid");

const worksCount = document.getElementById("worksCount");

// ==================================================
// SESSION
// ==================================================

function getToken() {
  return sessionStorage.getItem("puria_admin_token");
}

function saveToken(token) {
  sessionStorage.setItem("puria_admin_token", token);
}

function clearToken() {
  sessionStorage.removeItem("puria_admin_token");
}

// ==================================================
// SHOW PANEL
// ==================================================

function showPanel() {
  loginBox.classList.add("hidden");

  panelBox.classList.remove("hidden");

  loadWorks();
}

// ==================================================
// SHOW LOGIN
// ==================================================

function showLogin() {
  panelBox.classList.add("hidden");

  loginBox.classList.remove("hidden");

  passwordInput.value = "";
}

// ==================================================
// LOGIN
// ==================================================

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const password = passwordInput.value.trim();

  if (!password) {
    return;
  }

  loginButton.disabled = true;

  loginMessage.textContent = "در حال بررسی...";

  loginMessage.className = "message";

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        password: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "ورود ناموفق بود.");
    }

    saveToken(data.token);

    loginMessage.textContent = "";

    showPanel();
  } catch (error) {
    loginMessage.textContent = error.message;

    loginMessage.className = "message error";
  } finally {
    loginButton.disabled = false;
  }
});

// ==================================================
// LOGOUT
// ==================================================

logoutButton.addEventListener("click", () => {
  clearToken();

  showLogin();
});

// ==================================================
// FILE SELECT
// ==================================================

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];

  if (!file) {
    uploadButton.disabled = true;

    preview.classList.add("hidden");

    return;
  }

  // 10MB

  if (file.size > 10 * 1024 * 1024) {
    uploadMessage.textContent = "حجم فایل بیشتر از 10MB است.";

    uploadMessage.className = "message error";

    imageInput.value = "";

    uploadButton.disabled = true;

    return;
  }

  uploadMessage.textContent = "";

  fileName.textContent = file.name;

  const reader = new FileReader();

  reader.onload = (event) => {
    previewImage.src = event.target.result;

    preview.classList.remove("hidden");
  };

  reader.readAsDataURL(file);

  uploadButton.disabled = false;
});

// ==================================================
// UPLOAD
// ==================================================

uploadButton.addEventListener("click", async () => {
  const file = imageInput.files[0];

  if (!file) {
    return;
  }

  const token = getToken();

  if (!token) {
    showLogin();

    return;
  }

  uploadButton.disabled = true;

  uploadButton.textContent = "در حال آپلود...";

  uploadMessage.textContent = "";

  try {
    const formData = new FormData();

    formData.append("image", file);

    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
      },

      body: formData,
    });

    const data = await response.json();

    // Session expired

    if (response.status === 401) {
      clearToken();

      showLogin();

      loginMessage.textContent = "نشست شما منقضی شده؛ دوباره وارد شوید.";

      loginMessage.className = "message error";

      return;
    }

    if (!response.ok) {
      throw new Error(data.message || "آپلود ناموفق بود.");
    }

    uploadMessage.textContent = `✅ ${data.fileName} با موفقیت آپلود شد.`;

    uploadMessage.className = "message success";

    // Reset

    imageInput.value = "";

    preview.classList.add("hidden");

    uploadButton.disabled = true;

    // Reload works

    await loadWorks();
  } catch (error) {
    uploadMessage.textContent = error.message;

    uploadMessage.className = "message error";
  } finally {
    uploadButton.textContent = "آپلود تصویر";

    if (imageInput.files.length > 0) {
      uploadButton.disabled = false;
    }
  }
});

// ==================================================
// LOAD WORKS
// ==================================================

async function loadWorks() {
  try {
    const response = await fetch(API_URL);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "خطا در دریافت پروژه‌ها.");
    }

    worksGrid.innerHTML = "";

    worksCount.textContent = `${data.images.length} پروژه`;

    data.images
      .slice()
      .reverse()
      .forEach((image) => {
        const card = document.createElement("div");

        card.className = "work-card";

        card.innerHTML = `

                        <img
                            src="${image.url}"
                            alt="${image.name}"
                            loading="lazy"
                        >

                        <p>
                            ${image.name}
                        </p>

                    `;

        worksGrid.appendChild(card);
      });
  } catch (error) {
    worksGrid.innerHTML = `
            <p class="message error">
                ${error.message}
            </p>
        `;
  }
}

// ==================================================
// CHECK EXISTING SESSION
// ==================================================

if (getToken()) {
  showPanel();
} else {
  showLogin();
}
