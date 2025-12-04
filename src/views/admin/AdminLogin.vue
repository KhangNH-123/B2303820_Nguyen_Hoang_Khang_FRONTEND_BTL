<template>
  <div class="admin-login-page py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow border-0">
            <div class="card-header bg-dark text-white text-center py-4">
              <i class="fas fa-lock fa-3x mb-3"></i>
              <h3 class="mb-0">Đăng nhập Admin</h3>
            </div>
            <div class="card-body p-4">
              <form @submit.prevent="login">
                <div class="mb-3">
                  <label for="msnv" class="form-label">MSNV</label>
                  <div class="input-group">
                    <span class="input-group-text"
                      ><i class="fas fa-id-card"></i
                    ></span>
                    <input
                      v-model="msnv"
                      type="text"
                      class="form-control"
                      id="msnv"
                      placeholder="Nhập MSNV"
                      required
                    />
                  </div>
                </div>

                <div class="mb-4">
                  <label for="password" class="form-label">Mật khẩu</label>
                  <div class="input-group">
                    <span class="input-group-text"
                      ><i class="fas fa-lock"></i
                    ></span>
                    <input
                      v-model="password"
                      type="password"
                      class="form-control"
                      id="password"
                      placeholder="Nhập mật khẩu"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn btn-dark w-100 py-2"
                  :disabled="loading"
                >
                  <span
                    v-if="loading"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  <i class="fas fa-sign-in-alt me-2"></i>
                  {{ loading ? "Đang đăng nhập..." : "Đăng nhập" }}
                </button>
              </form>

              <div class="text-center mt-3">
                <p class="text-muted small">
                  <i class="fas fa-info-circle me-1"></i>
                  Chỉ dành cho nhân viên thư viện
                </p>
                <router-link to="/login" class="text-dark text-decoration-none">
                  <i class="fas fa-arrow-left me-1"></i>Về trang đăng nhập user
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAdminStore } from "../../stores/adminStore";
import { useRouter } from "vue-router";

const msnv = ref("");
const password = ref("");
const loading = ref(false);
const adminStore = useAdminStore();
const router = useRouter();

async function login() {
  try {
    loading.value = true;
    console.log("Attempting admin login with MSNV:", msnv.value);

    const result = await adminStore.login(msnv.value, password.value);

    console.log("🔐🔐🔐 Admin login COMPLETE - Result:", result);
    console.log(
      "🔐 Token received:",
      result.token ? `YES (${result.token.length} chars)` : "NO"
    );

    console.log("Admin login successful, redirecting to dashboard...");

    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log("🔐🔐🔐 FINAL CHECK before redirect:");
    console.log("   adminStore.isLoggedIn:", adminStore.isLoggedIn);
    console.log(
      "   Token in localStorage:",
      !!localStorage.getItem("adminToken")
    );

    router.push("/admin/dashboard");
  } catch (error) {
    console.error("Admin login failed:", error);
    alert(
      "Đăng nhập thất bại: " + (error.response?.data?.message || error.message)
    );
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.admin-login-page {
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  min-height: 100vh;
}

.card {
  border-radius: 15px;
}

.card-header {
  border-radius: 15px 15px 0 0 !important;
}

.input-group-text {
  background-color: #f8f9fa;
  border-right: none;
}

.form-control {
  border-left: none;
}

.form-control:focus {
  box-shadow: none;
  border-color: #ced4da;
}
</style>
