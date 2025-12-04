<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
    <div class="container">
      <router-link class="navbar-brand fw-bold" to="/admin/dashboard">
        <i class="fas fa-cogs me-2"></i>Admin Panel
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#adminNavbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="adminNavbar">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/admin/dashboard">
              <i class="fas fa-tachometer-alt me-1"></i>Dashboard
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/admin/pending">
              <i class="fas fa-clock me-1"></i>Chờ duyệt
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/admin/approved">
              <i class="fas fa-check-circle me-1"></i>Đã duyệt
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/admin/manage-sach">
              <i class="fas fa-book me-1"></i>Quản lý sách
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/admin/borrow-all">
              <i class="fas fa-list me-1"></i>Lịch sử mượn
            </router-link>
          </li>
        </ul>

        <ul class="navbar-nav">
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              <i class="fas fa-user-cog me-1"></i>Admin
            </a>
            <ul class="dropdown-menu">
              <li v-if="!adminStore.isLoggedIn">
                <router-link class="dropdown-item" to="/admin/login">
                  <i class="fas fa-sign-in-alt me-1"></i>Đăng nhập
                </router-link>
              </li>

              <li v-else>
                <div class="dropdown-item-text px-3 py-2">
                  <small class="text-muted d-block">
                    <i class="fas fa-user-circle me-1"></i>
                    Đang đăng nhập:
                  </small>
                  <strong class="d-block mt-1">
                    {{ adminStore.admin?.HoTenNV || "Admin" }}
                  </strong>
                  <small class="text-muted d-block mt-1">
                    MSNV: {{ adminStore.admin?.MSNV }}
                  </small>
                </div>
                <div class="dropdown-divider"></div>
                <button
                  class="dropdown-item text-warning"
                  @click="showLogoutConfirm"
                >
                  <i class="fas fa-exchange-alt me-1"></i>Đăng xuất để đăng nhập
                  tài khoản khác
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <div v-if="showLogoutModal" class="modal-backdrop show"></div>
  <div v-if="showLogoutModal" class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-sign-out-alt me-2"></i>Xác nhận đăng xuất
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="closeLogoutModal"
          ></button>
        </div>
        <div class="modal-body">
          <p>
            <i class="fas fa-info-circle text-warning me-2"></i>
            Bạn đang đăng nhập với tài khoản
            <strong>{{ adminStore.admin?.HoTenNV }}</strong> (MSNV:
            {{ adminStore.admin?.MSNV }}).
          </p>
          <p class="mb-0">
            <strong>Bạn có chắc chắn muốn đăng xuất không?</strong>
          </p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="closeLogoutModal"
          >
            <i class="fas fa-times me-1"></i>Huỷ
          </button>
          <button type="button" class="btn btn-primary" @click="confirmLogout">
            <i class="fas fa-check me-1"></i>Đăng xuất
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAdminStore } from "../stores/adminStore";
import { useRouter } from "vue-router";

const adminStore = useAdminStore();
const router = useRouter();

const showLogoutModal = ref(false);

const showLogoutConfirm = () => {
  showLogoutModal.value = true;
};

const closeLogoutModal = () => {
  showLogoutModal.value = false;
};

const confirmLogout = () => {
  console.log("🔐 Admin logout confirmed");
  adminStore.logout();
  closeLogoutModal();
  router.push("/admin/login");
};

onMounted(() => {
  console.log(
    "🔄 AdminNavbar mounted - Checking login status:",
    adminStore.isLoggedIn
  );
  console.log("👤 Admin data:", adminStore.admin);
});
</script>

<style scoped>
.navbar-brand {
  font-size: 1.3rem;
}

.nav-link {
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #fff !important;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.modal-title {
  color: var(--primary-color);
  font-weight: 600;
}

.dropdown-item-text small {
  font-size: 0.875rem;
}

.dropdown-item-text strong {
  font-size: 0.95rem;
}
</style>
