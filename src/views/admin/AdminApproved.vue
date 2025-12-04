<template>
  <div class="admin-approved-page py-4">
    <div class="container">
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="h2 fw-bold text-dark">
            <i class="fas fa-check-circle me-2"></i>Lịch sử đã duyệt
          </h1>
          <p class="text-muted">
            Xem tất cả yêu cầu mượn sách đã từng được duyệt (bao gồm cả đã trả)
          </p>
        </div>
      </div>

      <div v-if="debugInfo" class="alert alert-info">
        <h6><i class="fas fa-bug me-2"></i>Debug Information</h6>
        <p class="mb-1">
          <strong>Total Records:</strong> {{ approvedRequests.length }}
        </p>
        <p class="mb-1"><strong>Loading:</strong> {{ loading }}</p>
        <p class="mb-0"><strong>Error:</strong> {{ error }}</p>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Đang tải yêu cầu...</p>
      </div>

      <div v-else-if="error" class="alert alert-danger">
        <i class="fas fa-exclamation-triangle me-2"></i>
        {{ error }}
        <button
          @click="loadApprovedRequests"
          class="btn btn-sm btn-outline-danger ms-3"
        >
          <i class="fas fa-redo me-1"></i>Thử lại
        </button>
      </div>

      <div v-else-if="approvedRequests.length === 0" class="text-center py-5">
        <i class="fas fa-check fa-3x text-muted mb-3"></i>
        <h4 class="text-muted">Không có yêu cầu nào đã duyệt</h4>
        <p class="text-muted">Chưa có yêu cầu mượn sách nào được duyệt.</p>
        <div class="mt-3">
          <router-link to="/admin/pending" class="btn btn-primary me-2">
            <i class="fas fa-clock me-1"></i>Kiểm tra yêu cầu chờ
          </router-link>
          <button @click="loadApprovedRequests" class="btn btn-outline-primary">
            <i class="fas fa-redo me-1"></i>Tải lại
          </button>
        </div>
      </div>

      <div v-else class="row">
        <div class="col-12">
          <div class="card shadow border-0">
            <div class="card-header bg-success text-white py-3">
              <h5 class="card-title mb-0">
                <i class="fas fa-history me-2"></i>
                Lịch sử đã duyệt ({{ approvedRequests.length }})
                <small class="d-block mt-1 fs-6 fw-normal">
                  Bao gồm: {{ getCountByStatus("approved") }} đang mượn •
                  {{ getCountByStatus("returned") }} đã trả
                </small>
              </h5>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>Độc giả</th>
                      <th>Sách</th>
                      <th>Ngày mượn</th>
                      <th>Ngày trả dự kiến</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="request in approvedRequests" :key="request._id">
                      <td>
                        <strong v-if="request.MaDocGia">
                          {{ request.MaDocGia.HoLot }}
                          {{ request.MaDocGia.Ten }}
                        </strong>
                        <span v-else class="text-muted">Đang tải...</span>
                        <br />
                        <small
                          class="text-muted"
                          v-if="request.MaDocGia?.email"
                        >
                          {{ request.MaDocGia.email }}
                        </small>
                      </td>
                      <td>
                        <strong v-if="request.MaSach">
                          {{ request.MaSach.TenSach }}
                        </strong>
                        <span v-else class="text-muted">Đang tải...</span>
                        <br />
                        <small class="text-muted" v-if="request.MaSach?.TacGia">
                          Tác giả: {{ request.MaSach.TacGia }}
                        </small>
                      </td>
                      <td>
                        {{ formatDate(request.NgayMuon) }}
                      </td>
                      <td>
                        {{ formatDate(request.NgayTraDuKien) }}
                      </td>
                      <td>
                        <span class="badge bg-success">Đang mượn</span>
                      </td>
                      <td>
                        <button
                          @click="markAsReturned(request._id)"
                          class="btn btn-info btn-sm"
                          :disabled="processingRequest === request._id"
                        >
                          <span
                            v-if="processingRequest === request._id"
                            class="spinner-border spinner-border-sm me-1"
                          ></span>
                          <i class="fas fa-undo me-1"></i>Đánh dấu đã trả
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
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

const approvedRequests = ref([]);
const loading = ref(false);
const error = ref("");
const processingRequest = ref("");
const debugInfo = ref(true);

const getCountByStatus = (status) => {
  return approvedRequests.value.filter((request) => request.status === status)
    .length;
};

const loadApprovedRequests = async () => {
  try {
    if (!adminStore.token) {
      console.error("❌ No admin token available");
      error.value = "Vui lòng đăng nhập lại";
      return;
    }

    loading.value = true;
    error.value = "";
    console.log("🔄 Loading approved requests...");
    console.log("🔐 Admin token exists:", !!adminStore.token);

    const response = await adminService.getApprovedBorrows(adminStore.token);
    approvedRequests.value = response;

    console.log("✅ Approved requests loaded:", approvedRequests.value.length);
  } catch (err) {
    console.error("❌ Error loading approved requests:", err);

    if (err.response?.status === 401) {
      error.value = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
    } else {
      error.value =
        "Lỗi khi tải danh sách yêu cầu đã duyệt: " +
        (err.response?.data?.message || err.message || "Unknown error");
    }
  } finally {
    loading.value = false;
  }
};

const markAsReturned = async (requestId) => {
  if (!confirm("Bạn có chắc chắn muốn đánh dấu sách đã được trả?")) {
    return;
  }

  try {
    processingRequest.value = requestId;
    console.log("🔄 Marking as returned:", requestId);

    await adminService.returnBorrow(adminStore.token, requestId);

    alert("✅ Đã đánh dấu sách đã được trả!");

    await loadApprovedRequests();
  } catch (err) {
    console.error("❌ Error marking as returned:", err);
    alert(
      "Lỗi khi đánh dấu đã trả: " + (err.response?.data?.message || err.message)
    );
  } finally {
    processingRequest.value = "";
  }
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
  console.log("🏁 AdminApproved component mounted");
  loadApprovedRequests();
});
</script>

<style scoped>
.admin-approved-page {
  background-color: #f8f9fc;
  min-height: calc(100vh - 76px);
}

.table th {
  border-top: none;
  font-weight: 600;
  color: var(--primary-color);
}

.card {
  border-radius: 10px;
  overflow: hidden;
}

.card-header {
  border-radius: 0 !important;
}

.badge {
  font-size: 0.75rem;
}
</style>
