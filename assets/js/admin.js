/**
 * admin.js
 * Core Controller & UI Helpers for Portfolio Admin Dashboard
 */

const AdminUI = {
  // Initialize admin layout, authentication checks, notifications & listeners
  init(activePageId = "dashboard") {
    this.checkAuth();
    this.setupSidebarToggle();
    this.updateNotificationBadges();
    this.setupUserDropdown();
    this.highlightActiveNav(activePageId);

    // Listen for store data changes to keep badges in sync
    window.addEventListener("portfolioDataChanged", () => {
      this.updateNotificationBadges();
    });
  },

  checkAuth() {
    // If not logged in and not on login page, redirect
    const isLoginPage = window.location.pathname.endsWith("login.html");
    if (typeof PortfolioStore !== "undefined") {
      const loggedIn = PortfolioStore.isAdminLoggedIn();
      if (!loggedIn && !isLoginPage) {
        window.location.href = "login.html";
      } else if (loggedIn && isLoginPage) {
        window.location.href = "index.html";
      }
    }
  },

  highlightActiveNav(pageId) {
    document.querySelectorAll(".sidebar-link").forEach((link) => {
      if (link.getAttribute("data-page") === pageId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  },

  setupSidebarToggle() {
    const toggleBtn = document.getElementById("sidebarToggleBtn");
    const sidebar = document.querySelector(".admin-sidebar");
    let backdrop = document.querySelector(".admin-sidebar-backdrop");

    if (!backdrop && sidebar) {
      backdrop = document.createElement("div");
      backdrop.className = "admin-sidebar-backdrop";
      document.body.appendChild(backdrop);
    }

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("show-sidebar");
        if (backdrop) backdrop.classList.toggle("show");
      });
    }

    if (backdrop && sidebar) {
      backdrop.addEventListener("click", () => {
        sidebar.classList.remove("show-sidebar");
        backdrop.classList.remove("show");
      });
    }
  },

  setupUserDropdown() {
    const logoutBtn = document.getElementById("adminLogoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.confirmAction({
          title: "Confirm Logout",
          message: "Are you sure you want to sign out of the Admin Panel?",
          confirmBtnText: "Logout",
          confirmBtnClass: "btn-danger",
          onConfirm: () => {
            PortfolioStore.logout();
            window.location.href = "login.html";
          }
        });
      });
    }

    // Populate user display info if element exists
    const user = PortfolioStore.getCurrentUser();
    const nameEl = document.getElementById("adminUserName");
    if (nameEl && user) {
      nameEl.textContent = user.name || "Admin";
    }
  },

  updateNotificationBadges() {
    if (typeof PortfolioStore === "undefined") return;
    const unreadCount = PortfolioStore.getUnreadMessageCount();

    // Badges in sidebar and topbar
    document.querySelectorAll(".badge-messages-count").forEach((el) => {
      if (unreadCount > 0) {
        el.textContent = unreadCount;
        el.classList.remove("d-none");
      } else {
        el.classList.add("d-none");
      }
    });

    const dot = document.getElementById("topbarMessageDot");
    if (dot) {
      if (unreadCount > 0) {
        dot.classList.remove("d-none");
      } else {
        dot.classList.add("d-none");
      }
    }
  },

  showToast(message, type = "success") {
    let container = document.getElementById("adminToastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "adminToastContainer";
      document.body.appendChild(container);
    }

    const toastId = "toast-" + Date.now();
    const bgClass =
      type === "success"
        ? "bg-success text-white"
        : type === "danger"
        ? "bg-danger text-white"
        : type === "warning"
        ? "bg-warning text-dark"
        : "bg-primary text-white";

    const icon =
      type === "success"
        ? "bi-check-circle-fill"
        : type === "danger"
        ? "bi-exclamation-triangle-fill"
        : type === "warning"
        ? "bi-exclamation-circle-fill"
        : "bi-info-circle-fill";

    const toastEl = document.createElement("div");
    toastEl.className = `toast admin-toast align-items-center ${bgClass} border-0 show`;
    toastEl.id = toastId;
    toastEl.setAttribute("role", "alert");
    toastEl.setAttribute("aria-live", "assertive");
    toastEl.setAttribute("aria-atomic", "true");

    toastEl.innerHTML = `
      <div class="d-flex p-3">
        <div class="toast-body d-flex align-items-center gap-2 flex-grow-1 font-monospace" style="font-size: 0.9rem; font-family: inherit !important;">
          <i class="bi ${icon} fs-5"></i>
          <span>${message}</span>
        </div>
        <button type="button" class="btn-close ${type === "warning" ? "" : "btn-close-white"} me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    container.appendChild(toastEl);

    // Auto remove after 3.5 seconds
    setTimeout(() => {
      toastEl.classList.remove("show");
      setTimeout(() => toastEl.remove(), 300);
    }, 3500);

    const closeBtn = toastEl.querySelector(".btn-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        toastEl.classList.remove("show");
        setTimeout(() => toastEl.remove(), 300);
      });
    }
  },

  confirmAction({
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmBtnText = "Confirm",
    confirmBtnClass = "btn-danger",
    onConfirm = null
  }) {
    let modalEl = document.getElementById("adminConfirmModal");
    if (!modalEl) {
      modalEl = document.createElement("div");
      modalEl.className = "modal fade";
      modalEl.id = "adminConfirmModal";
      modalEl.tabIndex = -1;
      modalEl.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title fw-bold" id="confirmModalTitle"></h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body py-4">
              <p class="mb-0 text-muted" id="confirmModalMessage"></p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-admin-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn ${confirmBtnClass}" id="confirmModalBtn">${confirmBtnText}</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modalEl);
    }

    document.getElementById("confirmModalTitle").textContent = title;
    document.getElementById("confirmModalMessage").textContent = message;
    const confirmBtn = document.getElementById("confirmModalBtn");
    confirmBtn.className = `btn ${confirmBtnClass}`;
    confirmBtn.textContent = confirmBtnText;

    const bsModal = new bootstrap.Modal(modalEl);

    // Clone button to remove previous event listeners cleanly
    const newBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);

    newBtn.addEventListener("click", () => {
      bsModal.hide();
      if (typeof onConfirm === "function") {
        onConfirm();
      }
    });

    bsModal.show();
  }
};

// Global export
if (typeof window !== "undefined") {
  window.AdminUI = AdminUI;
}
