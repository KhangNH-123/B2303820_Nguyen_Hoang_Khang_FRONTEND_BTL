<template>
  <div class="user-profile-page py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="text-center mb-5">
            <h1 class="h2 fw-bold text-primary">
              <i class="fas fa-user-circle me-2"></i>Thông tin cá nhân
            </h1>
            <p class="text-muted">Quản lý thông tin tài khoản của bạn</p>
          </div>

          <div v-if="!userStore.user" class="card shadow border-0">
            <div class="card-body text-center py-5">
              <i class="fas fa-user-slash fa-3x text-muted mb-3"></i>
              <h4 class="text-muted mb-3">Không có tài khoản đang đăng nhập</h4>
              <p class="text-muted mb-4">
                Vui lòng đăng nhập để xem thông tin cá nhân
              </p>
              <router-link to="/login" class="btn btn-primary btn-lg">
                <i class="fas fa-sign-in-alt me-2"></i>Đăng nhập ngay
              </router-link>
            </div>
          </div>

          <div v-else class="card shadow border-0">
            <div class="card-header bg-primary text-white py-3">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">
                  <i class="fas fa-id-card me-2"></i>Thông tin tài khoản
                </h5>
                <button
                  @click="openEditModal"
                  class="btn btn-light btn-sm"
                  title="Chỉnh sửa thông tin"
                >
                  <i class="fas fa-edit me-1"></i>Chỉnh sửa
                </button>
              </div>
            </div>
            <div class="card-body p-4">
              <div v-if="error" class="alert alert-warning">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ error }}
              </div>

              <div class="text-center mb-4">
                <div class="avatar-circle mb-3">
                  <i class="fas fa-user fa-2x text-white"></i>
                </div>
                <h4 class="fw-bold">
                  {{ userStore.user.HoLot }} {{ userStore.user.Ten }}
                </h4>
                <p class="text-muted">
                  Mã độc giả: {{ userStore.user.MaDocGia || "Chưa có" }}
                </p>
              </div>

              <div class="row">
                <div class="col-12 mb-3">
                  <label class="form-label fw-bold text-primary"
                    >Họ và tên</label
                  >
                  <div class="info-field">
                    {{ userStore.user.HoLot }} {{ userStore.user.Ten }}
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold text-primary">Email</label>
                  <div class="info-field">
                    {{ userStore.user.email || "Chưa cập nhật" }}
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold text-primary"
                    >Điện thoại</label
                  >
                  <div class="info-field">
                    {{ userStore.user.DienThoai || "Chưa cập nhật" }}
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold text-primary"
                    >Ngày sinh</label
                  >
                  <div class="info-field">
                    {{ formatDate(userStore.user.NgaySinh) || "Chưa cập nhật" }}
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold text-primary"
                    >Giới tính</label
                  >
                  <div class="info-field">
                    {{ formatGender(userStore.user.Phai) }}
                  </div>
                </div>

                <div class="col-12 mb-3">
                  <label class="form-label fw-bold text-primary">Địa chỉ</label>
                  <div class="info-field">
                    {{ userStore.user.DiaChi || "Chưa cập nhật" }}
                  </div>
                </div>
              </div>

              <div class="stats-section mt-4 p-3 bg-light rounded">
                <h6 class="fw-bold text-primary mb-3">
                  <i class="fas fa-chart-bar me-2"></i>Thống kê mượn sách
                </h6>
                <div class="row text-center">
                  <div class="col-4">
                    <div class="stat-item">
                      <div class="stat-number text-primary fw-bold">
                        {{ stats.pending }}
                      </div>
                      <div class="stat-label text-muted small">Chờ duyệt</div>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="stat-item">
                      <div class="stat-number text-warning fw-bold">
                        {{ stats.approved }}
                      </div>
                      <div class="stat-label text-muted small">Đang mượn</div>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="stat-item">
                      <div class="stat-number text-success fw-bold">
                        {{ stats.returned }}
                      </div>
                      <div class="stat-label text-muted small">Đã trả</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="action-buttons mt-4 pt-3 border-top">
                <div class="row g-2">
                  <div class="col-md-6">
                    <router-link
                      to="/my-borrow"
                      class="btn btn-outline-primary w-100"
                    >
                      <i class="fas fa-book me-2"></i>Xem chi tiết mượn sách
                    </router-link>
                  </div>
                  <div class="col-md-6">
                    <button
                      @click="logout"
                      class="btn btn-outline-danger w-100"
                    >
                      <i class="fas fa-sign-out-alt me-2"></i>Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showEditModal" class="modal-backdrop show"></div>
    <div v-if="showEditModal" class="modal fade show d-block">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-warning text-dark">
            <h5 class="modal-title">
              <i class="fas fa-edit me-2"></i>Chỉnh sửa thông tin cá nhân
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="closeEditModal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveProfile">
              <div v-if="editError" class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ editError }}
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label"
                    >Họ <span class="text-danger">*</span></label
                  >
                  <input
                    v-model="editForm.HoLot"
                    type="text"
                    class="form-control"
                    required
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label"
                    >Tên <span class="text-danger">*</span></label
                  >
                  <input
                    v-model="editForm.Ten"
                    type="text"
                    class="form-control"
                    required
                  />
                </div>

                <div class="col-12 mb-3">
                  <label class="form-label"
                    >Email <span class="text-danger">*</span></label
                  >
                  <input
                    v-model="editForm.email"
                    type="email"
                    class="form-control"
                    required
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label"
                    >Số điện thoại <span class="text-danger">*</span></label
                  >
                  <input
                    v-model="editForm.DienThoai"
                    type="tel"
                    class="form-control"
                    required
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Ngày sinh</label>
                  <input
                    v-model="editForm.NgaySinh"
                    type="date"
                    class="form-control"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Giới tính</label>
                  <div>
                    <div class="form-check form-check-inline">
                      <input
                        v-model="editForm.Phai"
                        class="form-check-input"
                        type="radio"
                        id="edit-male"
                        value="Nam"
                      />
                      <label class="form-check-label" for="edit-male"
                        >Nam</label
                      >
                    </div>
                    <div class="form-check form-check-inline">
                      <input
                        v-model="editForm.Phai"
                        class="form-check-input"
                        type="radio"
                        id="edit-female"
                        value="Nu"
                      />
                      <label class="form-check-label" for="edit-female"
                        >Nữ</label
                      >
                    </div>
                    <div class="form-check form-check-inline">
                      <input
                        v-model="editForm.Phai"
                        class="form-check-input"
                        type="radio"
                        id="edit-other"
                        value="Khac"
                      />
                      <label class="form-check-label" for="edit-other"
                        >Khác</label
                      >
                    </div>
                  </div>
                </div>

                <div class="col-12 mb-3">
                  <label class="form-label">Địa chỉ</label>
                  <textarea
                    v-model="editForm.DiaChi"
                    class="form-control"
                    rows="2"
                  ></textarea>
                </div>

                <div class="col-12 mb-3">
                  <div class="card border-info">
                    <div class="card-header bg-info text-white py-2">
                      <h6 class="mb-0">
                        <i class="fas fa-key me-1"></i>Thay đổi mật khẩu (tùy
                        chọn)
                      </h6>
                    </div>
                    <div class="card-body">
                      <div class="mb-2">
                        <label class="form-label">Mật khẩu mới</label>
                        <input
                          v-model="editForm.newPassword"
                          type="password"
                          class="form-control"
                          placeholder="Để trống nếu không đổi mật khẩu"
                          minlength="6"
                        />
                        <div class="form-text">
                          Mật khẩu phải có ít nhất 6 ký tự
                        </div>
                      </div>
                      <div>
                        <label class="form-label">Xác nhận mật khẩu mới</label>
                        <input
                          v-model="editForm.confirmPassword"
                          type="password"
                          class="form-control"
                          placeholder="Xác nhận mật khẩu mới"
                        />
                        <div
                          v-if="passwordMismatch"
                          class="text-danger small mt-1"
                        >
                          Mật khẩu xác nhận không khớp
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                <strong>Lưu ý:</strong> Các trường có dấu * là bắt buộc.
              </div>

              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="closeEditModal"
                >
                  <i class="fas fa-times me-1"></i>Huỷ
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="savingProfile"
                  @click="testSave"
                >
                  <span
                    v-if="savingProfile"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  <i class="fas fa-save me-1"></i>Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div v-if="toast.show" class="toast-notification" :class="toast.type">
      <div class="toast-content">
        <i :class="toast.icon" class="me-2"></i>
        {{ toast.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "../stores/userStore";
import { useRouter } from "vue-router";
import muonService from "../services/muonService";
import docgiaService from "../services/docgiaService";

const testSave = async () => {
  console.log("🧪 Test save function");
  console.log("📝 Edit form:", editForm.value);
  console.log("🔐 passwordMismatch:", passwordMismatch.value);
  console.log("💾 docgiaService:", docgiaService);

  await saveProfile();
};

const userStore = useUserStore();
const router = useRouter();

const stats = ref({
  pending: 0,
  approved: 0,
  returned: 0,
  rejected: 0,
});

const loading = ref(false);
const error = ref("");
const showEditModal = ref(false);
const savingProfile = ref(false);
const editError = ref("");

const editForm = ref({
  HoLot: "",
  Ten: "",
  email: "",
  DienThoai: "",
  NgaySinh: "",
  Phai: "Khac",
  DiaChi: "",
  newPassword: "",
  confirmPassword: "",
});

const toast = ref({
  show: false,
  type: "",
  message: "",
  icon: "",
});

const passwordMismatch = computed(() => {
  return (
    editForm.value.newPassword &&
    editForm.value.confirmPassword &&
    editForm.value.newPassword !== editForm.value.confirmPassword
  );
});

const openEditModal = () => {
  if (!userStore.user) return;

  editForm.value = {
    HoLot: userStore.user.HoLot || "",
    Ten: userStore.user.Ten || "",
    email: userStore.user.email || "",
    DienThoai: userStore.user.DienThoai || "",
    NgaySinh: formatDateForInput(userStore.user.NgaySinh),
    Phai: userStore.user.Phai || "Khac",
    DiaChi: userStore.user.DiaChi || "",
    newPassword: "",
    confirmPassword: "",
  };

  editError.value = "";
  showEditModal.value = true;
};

const closeEditModal = () => {
  if (savingProfile.value) return;
  showEditModal.value = false;
  editForm.value = {
    HoLot: "",
    Ten: "",
    email: "",
    DienThoai: "",
    NgaySinh: "",
    Phai: "Khac",
    DiaChi: "",
    newPassword: "",
    confirmPassword: "",
  };
  editError.value = "";
};

const saveProfile = async () => {
  if (passwordMismatch.value) {
    editError.value = "Mật khẩu xác nhận không khớp";
    return;
  }

  if (
    !editForm.value.HoLot ||
    !editForm.value.Ten ||
    !editForm.value.email ||
    !editForm.value.DienThoai
  ) {
    editError.value = "Vui lòng điền đầy đủ các trường bắt buộc";
    return;
  }

  try {
    savingProfile.value = true;
    editError.value = "";

    const updateData = {
      HoLot: editForm.value.HoLot,
      Ten: editForm.value.Ten,
      email: editForm.value.email,
      DienThoai: editForm.value.DienThoai,
      NgaySinh: editForm.value.NgaySinh || null,
      Phai: editForm.value.Phai,
      DiaChi: editForm.value.DiaChi || "",
    };

    if (editForm.value.newPassword) {
      updateData.password = editForm.value.newPassword;
    }

    console.log("📤 Sending update data:", updateData);

    const result = await docgiaService.updateProfile(updateData);

    if (result.success) {
      userStore.user = result.user;
      localStorage.setItem("userData", JSON.stringify(result.user));

      showToast("success", "✅ Cập nhật thông tin thành công!");

      closeEditModal();

      await loadBorrowStats();
    } else {
      editError.value = result.message || "Cập nhật thất bại";
    }
  } catch (error) {
    console.error("❌ Error saving profile:", error);
    editError.value =
      error.response?.data?.message || "Lỗi khi cập nhật thông tin";
  } finally {
    savingProfile.value = false;
  }
};

const showToast = (type, message) => {
  const icons = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    warning: "fas fa-exclamation-triangle",
    info: "fas fa-info-circle",
  };

  toast.value = {
    show: true,
    type,
    message,
    icon: icons[type] || icons.info,
  };

  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

const formatDateForInput = (dateString) => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Date formatting error:", error);
    return "";
  }
};

const loadBorrowStats = async () => {
  if (!userStore.user) return;

  try {
    loading.value = true;
    error.value = "";
    console.log("👤 Loading borrow stats for user:", userStore.user._id);

    const borrowRecords = await muonService.getUserBorrows();

    stats.value = {
      pending: borrowRecords.filter((record) => record.status === "pending")
        .length,
      approved: borrowRecords.filter((record) => record.status === "approved")
        .length,
      returned: borrowRecords.filter((record) => record.status === "returned")
        .length,
      rejected: borrowRecords.filter((record) => record.status === "rejected")
        .length,
    };

    console.log("✅ Borrow stats loaded:", stats.value);
  } catch (err) {
    console.error("❌ Error loading borrow stats:", err);
    error.value =
      "Không thể tải thống kê mượn sách: " +
      (err.response?.data?.message || err.message);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch (error) {
    console.error("Date formatting error:", error);
    return "";
  }
};

const formatGender = (gender) => {
  if (!gender) return "Chưa cập nhật";

  const genderMap = {
    M: "Nam",
    Nam: "Nam",
    F: "Nữ",
    Nu: "Nữ",
    Nữ: "Nữ",
    Khac: "Khác",
    Khác: "Khác",
  };

  return genderMap[gender] || gender;
};

const logout = () => {
  if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
    userStore.logout();
    router.push("/");
  }
};

onMounted(() => {
  if (userStore.user) {
    loadBorrowStats();
  }
});

console.log("🔍 UserProfile component loaded");
console.log("👤 User from store:", userStore.user);
console.log("📁 docgiaService available:", !!docgiaService);
console.log("📁 docgiaService.updateProfile:", docgiaService?.updateProfile);
</script>

<style scoped>
.user-profile-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: calc(100vh - 76px);
}

.avatar-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(
    135deg,
    var(--primary-color) 0%,
    var(--secondary-color) 100%
  );
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #fff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.info-field {
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  min-height: 38px;
  display: flex;
  align-items: center;
}

.stat-item {
  padding: 10px;
}

.stat-number {
  font-size: 1.5rem;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  margin-top: 4px;
}

.stats-section {
  border-left: 4px solid var(--primary-color);
}

.action-buttons .btn {
  transition: all 0.3s ease;
}

.action-buttons .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card {
  border-radius: 15px;
  overflow: hidden;
}

.card-header {
  border-radius: 0 !important;
}

.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 9999;
  min-width: 300px;
  max-width: 400px;
  animation: slideIn 0.3s ease forwards;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toast-notification.success {
  background-color: #28a745;
  border-left: 4px solid #1e7e34;
}

.toast-notification.error {
  background-color: #dc3545;
  border-left: 4px solid #c82333;
}

.toast-notification.warning {
  background-color: #ffc107;
  border-left: 4px solid #e0a800;
  color: #212529;
}

.toast-notification.info {
  background-color: #17a2b8;
  border-left: 4px solid #138496;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

.card-header button {
  transition: all 0.3s ease;
}

.card-header button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
