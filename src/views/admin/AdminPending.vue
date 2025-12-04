<template>
  <div class="admin-pending-page py-4">
    <div class="container">
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="h2 fw-bold text-dark">
            <i class="fas fa-clock me-2"></i>Yêu cầu đang chờ duyệt
          </h1>
          <p class="text-muted">Duyệt các yêu cầu mượn sách mới từ độc giả</p>
        </div>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Đang tải yêu cầu...</p>
      </div>

      <div v-else-if="pendingRequests.length === 0" class="text-center py-5">
        <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
        <h4 class="text-muted">Không có yêu cầu nào đang chờ</h4>
        <p class="text-muted">Tất cả yêu cầu mượn sách đã được xử lý.</p>
      </div>

      <div v-else class="row">
        <div class="col-12">
          <div class="card shadow border-0">
            <div class="card-header bg-warning text-dark py-3">
              <h5 class="card-title mb-0">
                <i class="fas fa-list me-2"></i>
                Danh sách yêu cầu chờ duyệt ({{ pendingRequests.length }})
              </h5>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>Độc giả</th>
                      <th>Sách</th>
                      <th>Ngày yêu cầu</th>
                      <th>Ngày trả dự kiến</th>
                      <th>Số lượng có sẵn</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="request in pendingRequests" :key="request._id">
                      <td>
                        <strong
                          >{{ request.MaDocGia?.HoLot }}
                          {{ request.MaDocGia?.Ten }}</strong
                        >
                        <br />
                        <small class="text-muted">{{
                          request.MaDocGia?.email
                        }}</small>
                      </td>
                      <td>
                        <strong>{{ request.MaSach?.TenSach }}</strong>
                        <br />
                        <small class="text-muted"
                          >Tác giả: {{ request.MaSach?.TacGia }}</small
                        >
                      </td>
                      <td>
                        {{ formatDate(request.createdAt) }}
                      </td>
                      <td>
                        {{ formatDate(request.NgayTraDuKien) }}
                      </td>
                      <td>
                        <span
                          :class="{
                            'text-success': request.MaSach?.SoQuyen > 0,
                            'text-danger': request.MaSach?.SoQuyen <= 0,
                          }"
                        >
                          {{ request.MaSach?.SoQuyen || 0 }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <button
                            @click="approveRequest(request._id)"
                            class="btn btn-success"
                            :disabled="
                              processingRequest === request._id ||
                              request.MaSach?.SoQuyen <= 0
                            "
                            :title="
                              request.MaSach?.SoQuyen <= 0
                                ? 'Sách đã hết, không thể duyệt'
                                : 'Duyệt yêu cầu'
                            "
                          >
                            <span
                              v-if="processingRequest === request._id"
                              class="spinner-border spinner-border-sm me-1"
                            ></span>
                            <i class="fas fa-check me-1"></i>Duyệt
                          </button>
                          <button
                            @click="rejectRequest(request._id)"
                            class="btn btn-danger"
                            :disabled="processingRequest === request._id"
                          >
                            <span
                              v-if="processingRequest === request._id"
                              class="spinner-border spinner-border-sm me-1"
                            ></span>
                            <i class="fas fa-times me-1"></i>Từ chối
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-if="showConfirmModal" class="modal-backdrop show"></div>
                <div v-if="showConfirmModal" class="modal fade show d-block">
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-header" :class="modalHeaderClass">
                        <h5 class="modal-title">
                          <i :class="modalIconClass" class="me-2"></i
                          >{{ modalTitle }}
                        </h5>
                        <button
                          type="button"
                          class="btn-close"
                          @click="closeConfirmModal"
                        ></button>
                      </div>
                      <div class="modal-body">
                        <p v-if="confirmAction === 'approve'">
                          Bạn có chắc chắn muốn <strong>duyệt</strong> yêu cầu
                          mượn sách này?
                        </p>
                        <p v-if="confirmAction === 'reject'">
                          Bạn có chắc chắn muốn <strong>từ chối</strong> yêu cầu
                          mượn sách này?
                        </p>
                        <div
                          class="request-details p-3 bg-light rounded mt-3"
                          v-if="selectedRequest"
                        >
                          <p class="mb-1">
                            <strong>Độc giả:</strong>
                            {{ selectedRequest.MaDocGia?.HoLot }}
                            {{ selectedRequest.MaDocGia?.Ten }}
                          </p>
                          <p class="mb-1">
                            <strong>Sách:</strong>
                            {{ selectedRequest.MaSach?.TenSach }}
                          </p>
                          <p class="mb-0">
                            <strong>Số lượng có sẵn:</strong>
                            {{ selectedRequest.MaSach?.SoQuyen || 0 }}
                          </p>
                        </div>
                        <div
                          v-if="
                            confirmAction === 'approve' &&
                            selectedRequest?.MaSach?.SoQuyen <= 0
                          "
                          class="alert alert-warning mt-3"
                        >
                          <i class="fas fa-exclamation-triangle me-2"></i>
                          Sách đã hết, không thể duyệt yêu cầu!
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button
                          type="button"
                          class="btn btn-secondary"
                          @click="closeConfirmModal"
                        >
                          <i class="fas fa-times me-1"></i>Huỷ
                        </button>
                        <button
                          type="button"
                          class="btn"
                          :class="confirmButtonClass"
                          @click="executeConfirmAction"
                          :disabled="
                            processingRequest === selectedRequestId ||
                            (confirmAction === 'approve' &&
                              selectedRequest?.MaSach?.SoQuyen <= 0)
                          "
                        >
                          <span
                            v-if="processingRequest === selectedRequestId"
                            class="spinner-border spinner-border-sm me-2"
                          ></span>
                          <i :class="confirmButtonIcon" class="me-1"></i
                          >{{ confirmButtonText }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAdminStore } from "../../stores/adminStore";
import adminService from "../../services/adminService";

const adminStore = useAdminStore();

const pendingRequests = ref([]);
const loading = ref(false);
const processingRequest = ref("");

const showConfirmModal = ref(false);
const confirmAction = ref("");
const selectedRequestId = ref("");
const selectedRequest = ref(null);

const modalTitle = computed(() => {
  return confirmAction.value === "approve"
    ? "Xác nhận duyệt yêu cầu"
    : "Xác nhận từ chối yêu cầu";
});

const modalHeaderClass = computed(() => {
  return confirmAction.value === "approve"
    ? "bg-success text-white"
    : "bg-danger text-white";
});

const modalIconClass = computed(() => {
  return confirmAction.value === "approve"
    ? "fas fa-check-circle"
    : "fas fa-times-circle";
});

const confirmButtonClass = computed(() => {
  return confirmAction.value === "approve" ? "btn-success" : "btn-danger";
});

const confirmButtonIcon = computed(() => {
  return confirmAction.value === "approve" ? "fas fa-check" : "fas fa-times";
});

const confirmButtonText = computed(() => {
  return confirmAction.value === "approve"
    ? "Xác nhận duyệt"
    : "Xác nhận từ chối";
});

const loadPendingRequests = async () => {
  try {
    loading.value = true;
    console.log("Loading pending requests...");

    const response = await adminService.getPendingBorrows(adminStore.token);
    pendingRequests.value = response;

    console.log("Pending requests loaded:", pendingRequests.value);
  } catch (error) {
    console.error("Error loading pending requests:", error);
    alert(
      "Lỗi khi tải danh sách yêu cầu: " +
        (error.response?.data?.message || error.message)
    );
  } finally {
    loading.value = false;
  }
};

const approveRequest = (requestId) => {
  const request = pendingRequests.value.find((r) => r._id === requestId);
  if (!request) return;

  if (request.MaSach?.SoQuyen <= 0) {
    showToast("warning", "Sách đã hết, không thể duyệt!");
    return;
  }

  selectedRequestId.value = requestId;
  selectedRequest.value = request;
  confirmAction.value = "approve";
  showConfirmModal.value = true;
};

const rejectRequest = (requestId) => {
  const request = pendingRequests.value.find((r) => r._id === requestId);
  if (!request) return;

  selectedRequestId.value = requestId;
  selectedRequest.value = request;
  confirmAction.value = "reject";
  showConfirmModal.value = true;
};

const executeConfirmAction = async () => {
  if (!selectedRequestId.value) return;

  try {
    processingRequest.value = selectedRequestId.value;

    if (confirmAction.value === "approve") {
      console.log("Approving request:", selectedRequestId.value);
      await adminService.approveBorrow(
        adminStore.token,
        selectedRequestId.value
      );
      showToast("success", "✅ Đã duyệt yêu cầu mượn sách thành công!");
    } else {
      console.log("Rejecting request:", selectedRequestId.value);
      await adminService.rejectBorrow(
        adminStore.token,
        selectedRequestId.value
      );
      showToast("info", "⚠️ Đã từ chối yêu cầu mượn sách!");
    }

    closeConfirmModal();
    await loadPendingRequests();
  } catch (error) {
    console.error(`Error ${confirmAction.value}ing request:`, error);
    showToast(
      "error",
      `Lỗi: ${error.response?.data?.message || error.message}`
    );
  } finally {
    processingRequest.value = "";
  }
};

const closeConfirmModal = () => {
  if (processingRequest.value) return;

  showConfirmModal.value = false;
  selectedRequestId.value = "";
  selectedRequest.value = null;
  confirmAction.value = "";
};

const showToast = (type, message) => {
  const toast = document.createElement("div");
  toast.className = `toast-notification ${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <i class="fas fa-${
        type === "success"
          ? "check-circle"
          : type === "warning"
          ? "exclamation-triangle"
          : "exclamation-circle"
      } me-2"></i>
      ${message}
    </div>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
};

const formatDate = (dateString) => {
  if (!dateString) return "Chưa có";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch (error) {
    return "Invalid date";
  }
};

onMounted(() => {
  loadPendingRequests();
});
</script>

<style scoped>
.admin-pending-page {
  background-color: #f8f9fc;
  min-height: calc(100vh - 76px);
}

.table th {
  border-top: none;
  font-weight: 600;
  color: var(--primary-color);
}

.btn-group-sm > .btn {
  border-radius: 4px;
}

.card {
  border-radius: 10px;
  overflow: hidden;
}

.card-header {
  border-radius: 0 !important;
}
</style>
