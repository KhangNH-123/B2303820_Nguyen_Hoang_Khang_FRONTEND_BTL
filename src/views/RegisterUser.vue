<template>
  <div class="register-page py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow border-0">
            <div class="card-header bg-success text-white text-center py-4">
              <i class="fas fa-user-plus fa-3x mb-3"></i>
              <h3 class="mb-0">Đăng ký tài khoản</h3>
            </div>
            <div class="card-body p-4">
              <div v-if="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
              </div>

              <form @submit.prevent="register">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="holot" class="form-label"
                      >Họ <span class="text-danger">*</span></label
                    >
                    <div class="input-group">
                      <span class="input-group-text"
                        ><i class="fas fa-user"></i
                      ></span>
                      <input
                        v-model="formData.HoLot"
                        type="text"
                        class="form-control"
                        id="holot"
                        placeholder="Nhập họ "
                        required
                      />
                    </div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label for="ten" class="form-label"
                      >Tên <span class="text-danger">*</span></label
                    >
                    <input
                      v-model="formData.Ten"
                      type="text"
                      class="form-control"
                      id="ten"
                      placeholder="Nhập tên"
                      required
                    />
                  </div>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label"
                    >Email <span class="text-danger">*</span></label
                  >
                  <div class="input-group">
                    <span class="input-group-text"
                      ><i class="fas fa-envelope"></i
                    ></span>
                    <input
                      v-model="formData.email"
                      type="email"
                      class="form-control"
                      id="email"
                      placeholder="Nhập email"
                      required
                    />
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label"
                    >Mật khẩu <span class="text-danger">*</span></label
                  >
                  <div class="input-group">
                    <span class="input-group-text"
                      ><i class="fas fa-lock"></i
                    ></span>
                    <input
                      v-model="formData.password"
                      type="password"
                      class="form-control"
                      id="password"
                      placeholder="Nhập mật khẩu"
                      required
                      minlength="6"
                    />
                  </div>
                  <div class="form-text">Mật khẩu phải có ít nhất 6 ký tự</div>
                </div>

                <div class="mb-3">
                  <label for="confirmPassword" class="form-label"
                    >Xác nhận mật khẩu <span class="text-danger">*</span></label
                  >
                  <div class="input-group">
                    <span class="input-group-text"
                      ><i class="fas fa-lock"></i
                    ></span>
                    <input
                      v-model="confirmPassword"
                      type="password"
                      class="form-control"
                      id="confirmPassword"
                      placeholder="Nhập lại mật khẩu"
                      required
                    />
                  </div>
                  <div v-if="passwordMismatch" class="text-danger small">
                    Mật khẩu xác nhận không khớp
                  </div>
                </div>

                <div class="mb-3">
                  <label for="dienthoai" class="form-label"
                    >Số điện thoại <span class="text-danger">*</span></label
                  >
                  <div class="input-group">
                    <span class="input-group-text"
                      ><i class="fas fa-phone"></i
                    ></span>
                    <input
                      v-model="formData.DienThoai"
                      type="tel"
                      class="form-control"
                      id="dienthoai"
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="ngaysinh" class="form-label">Ngày sinh</label>
                    <input
                      v-model="formData.NgaySinh"
                      type="date"
                      class="form-control"
                      id="ngaysinh"
                    />
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">Giới tính</label>
                    <div>
                      <div class="form-check form-check-inline">
                        <input
                          v-model="formData.Phai"
                          class="form-check-input"
                          type="radio"
                          id="male"
                          value="Nam"
                        />
                        <label class="form-check-label" for="male">Nam</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          v-model="formData.Phai"
                          class="form-check-input"
                          type="radio"
                          id="female"
                          value="Nu"
                        />
                        <label class="form-check-label" for="female">Nữ</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          v-model="formData.Phai"
                          class="form-check-input"
                          type="radio"
                          id="other"
                          value="Khac"
                        />
                        <label class="form-check-label" for="other">Khác</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mb-4">
                  <label for="diachi" class="form-label">Địa chỉ</label>
                  <textarea
                    v-model="formData.DiaChi"
                    class="form-control"
                    id="diachi"
                    rows="2"
                    placeholder="Nhập địa chỉ"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  class="btn btn-success w-100 py-2"
                  :disabled="loading || passwordMismatch"
                >
                  <span
                    v-if="loading"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  <i class="fas fa-user-plus me-2"></i>
                  {{ loading ? "Đang đăng ký..." : "Đăng ký tài khoản" }}
                </button>
              </form>

              <div class="text-center mt-3">
                <p class="text-muted">
                  Đã có tài khoản?
                  <router-link
                    to="/login"
                    class="text-success text-decoration-none"
                    >Đăng nhập ngay</router-link
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "../stores/userStore";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();
const loading = ref(false);
const errorMessage = ref("");

const formData = ref({
  HoLot: "",
  Ten: "",
  email: "",
  password: "",
  DienThoai: "",
  NgaySinh: "",
  Phai: "Khac",
  DiaChi: "",
});

const confirmPassword = ref("");

const passwordMismatch = computed(() => {
  return (
    formData.value.password &&
    confirmPassword.value &&
    formData.value.password !== confirmPassword.value
  );
});

async function register() {
  if (passwordMismatch.value) {
    errorMessage.value = "Mật khẩu xác nhận không khớp";
    return;
  }

  if (
    !formData.value.HoLot ||
    !formData.value.Ten ||
    !formData.value.email ||
    !formData.value.password ||
    !formData.value.DienThoai
  ) {
    errorMessage.value = "Vui lòng điền đầy đủ các trường bắt buộc";
    return;
  }

  loading.value = true;
  errorMessage.value = "";

  try {
    await userStore.register(formData.value);
    router.push("/");
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.register-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: calc(100vh - 76px);
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
