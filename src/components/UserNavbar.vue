<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
    <div class="container">
      <router-link class="navbar-brand fw-bold" to="/">
        <i class="fas fa-book me-2"></i>Thư Viện Online
      </router-link>

      <button class="navbar-toggler" type="button" @click="toggleNavbar">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div
        class="collapse navbar-collapse"
        :class="{ show: isNavbarOpen }"
        id="navbarNav"
      >
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">
              <i class="fas fa-home me-1"></i>Trang chủ
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/sach">
              <i class="fas fa-book-open me-1"></i>Danh sách sách
            </router-link>
          </li>
          <li class="nav-item" v-if="userStore.user">
            <router-link class="nav-link" to="/my-borrow">
              <i class="fas fa-list me-1"></i>Sách đã mượn
            </router-link>
          </li>
        </ul>

        <ul class="navbar-nav">
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              @click="toggleDropdown('registerDropdown')"
            >
              <i class="fas fa-user-plus me-1"></i>Đăng ký
            </a>
            <ul
              class="dropdown-menu"
              :class="{ show: activeDropdown === 'registerDropdown' }"
            >
              <li v-if="!userStore.user">
                <router-link
                  class="dropdown-item"
                  to="/register"
                  @click="closeAllDropdowns"
                >
                  <i class="fas fa-user-plus me-1"></i>Đăng ký tài khoản mới
                </router-link>
              </li>
              <li v-else>
                <div class="dropdown-item-text px-3 py-2">
                  <small class="text-muted d-block">
                    <i class="fas fa-info-circle me-1"></i>
                    Đang đăng nhập tài khoản:
                  </small>
                  <strong class="d-block mt-1"
                    >{{ userStore.user.HoLot }} {{ userStore.user.Ten }}</strong
                  >
                </div>
                <div class="dropdown-divider"></div>
                <button
                  class="dropdown-item text-warning"
                  @click="handleRegisterWithLogout"
                >
                  <i class="fas fa-sign-out-alt me-1"></i>Đăng xuất để đăng ký
                  tài khoản mới
                </button>
              </li>
            </ul>
          </li>

          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              @click="toggleDropdown('loginDropdown')"
            >
              <i class="fas fa-sign-in-alt me-1"></i>Đăng nhập
            </a>
            <ul
              class="dropdown-menu"
              :class="{ show: activeDropdown === 'loginDropdown' }"
            >
              <li v-if="!userStore.user">
                <router-link
                  class="dropdown-item"
                  to="/login"
                  @click="closeAllDropdowns"
                >
                  <i class="fas fa-sign-in-alt me-1"></i>Đăng nhập User
                </router-link>
              </li>
              <li v-else>
                <div class="dropdown-item-text px-3 py-2">
                  <small class="text-muted d-block">
                    <i class="fas fa-user-circle me-1"></i>
                    Xin chào:
                  </small>
                  <strong class="d-block mt-1"
                    >{{ userStore.user.HoLot }} {{ userStore.user.Ten }}</strong
                  >
                </div>
                <div class="dropdown-divider"></div>
                <button
                  class="dropdown-item text-warning"
                  @click="handleLoginWithLogout"
                >
                  <i class="fas fa-exchange-alt me-1"></i>Đăng xuất để đăng nhập
                  tài khoản khác
                </button>
              </li>
            </ul>
          </li>

          <li class="nav-item">
            <router-link
              class="nav-link"
              to="/profile"
              @click="closeAllDropdowns"
            >
              <i class="fas fa-user me-1"></i>Người dùng
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <div v-if="showRegisterModal" class="modal-backdrop show"></div>
  <div v-if="showRegisterModal" class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-user-plus me-2"></i>Đăng ký tài khoản mới
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="closeRegisterModal"
          ></button>
        </div>
        <div class="modal-body">
          <p>
            <i class="fas fa-info-circle text-warning me-2"></i>
            Bạn đang đăng nhập với tài khoản
            <strong
              >{{ userStore.user?.HoLot }} {{ userStore.user?.Ten }}</strong
            >.
          </p>
          <p>Bạn cần đăng xuất để đăng ký tài khoản mới.</p>
          <p class="mb-0"><strong>Bạn có muốn đăng xuất không?</strong></p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="closeRegisterModal"
          >
            <i class="fas fa-times me-1"></i>Không
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="confirmRegisterLogout"
          >
            <i class="fas fa-check me-1"></i>Có, đăng xuất
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showLoginModal" class="modal-backdrop show"></div>
  <div v-if="showLoginModal" class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-sign-in-alt me-2"></i>Đăng nhập tài khoản khác
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="closeLoginModal"
          ></button>
        </div>
        <div class="modal-body">
          <p>
            <i class="fas fa-info-circle text-warning me-2"></i>
            Bạn đang đăng nhập với tài khoản
            <strong
              >{{ userStore.user?.HoLot }} {{ userStore.user?.Ten }}</strong
            >.
          </p>
          <p>Bạn cần đăng xuất để đăng nhập tài khoản khác.</p>
          <p class="mb-0"><strong>Bạn có muốn đăng xuất không?</strong></p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="closeLoginModal"
          >
            <i class="fas fa-times me-1"></i>Không
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="confirmLoginLogout"
          >
            <i class="fas fa-check me-1"></i>Có, đăng xuất
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "../stores/userStore";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const isNavbarOpen = ref(false);
const activeDropdown = ref("");
const showRegisterModal = ref(false);
const showLoginModal = ref(false);

onMounted(() => {
  console.log("User data in navbar:", userStore.user);
});

const toggleNavbar = () => {
  isNavbarOpen.value = !isNavbarOpen.value;
  activeDropdown.value = "";
};

const toggleDropdown = (dropdownName) => {
  if (activeDropdown.value === dropdownName) {
    activeDropdown.value = "";
  } else {
    activeDropdown.value = dropdownName;
  }
};

const closeAllDropdowns = () => {
  activeDropdown.value = "";
  isNavbarOpen.value = false;
};

const handleRegisterWithLogout = () => {
  console.log("Handle register with logout clicked");
  closeAllDropdowns();
  showRegisterModal.value = true;
};

const handleLoginWithLogout = () => {
  console.log("Handle login with logout clicked");
  closeAllDropdowns();
  showLoginModal.value = true;
};

const closeRegisterModal = () => {
  showRegisterModal.value = false;
};

const closeLoginModal = () => {
  showLoginModal.value = false;
};

const confirmRegisterLogout = () => {
  console.log("Confirm register logout");
  userStore.logout();
  closeRegisterModal();
  router.push("/register");
};

const confirmLoginLogout = () => {
  console.log("Confirm login logout");
  userStore.logout();
  closeLoginModal();
  router.push("/login");
};
</script>

<style scoped>
.navbar-brand {
  font-size: 1.5rem;
}

.nav-link {
  font-weight: 500;
  transition: color 0.3s ease;
  cursor: pointer;
}

.nav-link:hover {
  color: #fff !important;
}

.router-link-active.router-link-exact-active {
  color: #fff !important;
  font-weight: 600;
}

.dropdown-item-text small {
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .navbar-nav {
    text-align: center;
  }

  .dropdown-menu {
    border: none;
    box-shadow: none;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.95);
  }
}

.dropdown-item {
  cursor: pointer;
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

.dropdown-menu {
  transition: all 0.3s ease;
}

.navbar-collapse {
  transition: all 0.3s ease;
}
</style>
