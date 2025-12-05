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

      <!-- Debug info (có thể bật/tắt bằng cách thay đổi debugInfo.value) -->
      <!-- <div v-if="debugInfo" class="alert alert-info">
        <h6><i class="fas fa-bug me-2"></i>Debug Information</h6>
        <p class="mb-1">
          <strong>Total Records:</strong> {{ approvedRequests.length }}
        </p>
        <p class="mb-1"><strong>Loading:</strong> {{ loading }}</p>
        <p class="mb-0"><strong>Error:</strong> {{ error }}</p>
        <pre>{{ approvedRequests }}</pre>
      </div> -->

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
                  {{ getCountByStatus("returned") }} đã trả •
                  {{ getCountByStatus("overdue") }} quá hạn
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
                        <div
                          v-if="isOverdue(request)"
                          class="text-danger small"
                        >
                          <i class="fas fa-exclamation-triangle me-1"></i>Quá
                          hạn
                        </div>
                      </td>
                      <td>
                        <!-- Hiển thị trạng thái dựa trên request.status -->
                        <span
                          v-if="request.status === 'returned'"
                          class="badge bg-secondary"
                        >
                          <i class="fas fa-check-circle me-1"></i>Đã trả
                        </span>
                        <span
                          v-else-if="request.status === 'overdue'"
                          class="badge bg-danger"
                        >
                          <i class="fas fa-exclamation-triangle me-1"></i>Quá
                          hạn
                        </span>
                        <span v-else class="badge bg-success">
                          <i class="fas fa-book me-1"></i>Đang mượn
                        </span>

                        <!-- Hiển thị ngày trả thực tế nếu có -->
                        <div
                          v-if="request.NgayTraThucTe"
                          class="small text-muted mt-1"
                        >
                          Trả: {{ formatDate(request.NgayTraThucTe) }}
                        </div>
                      </td>
                      <td>
                        <!-- Chỉ hiển thị nút "Đánh dấu đã trả" khi sách chưa trả -->
                        <button
                          v-if="request.status !== 'returned'"
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
                        <span v-else class="text-muted">
                          <i class="fas fa-check-circle text-success me-1"></i
                          >Đã trả
                        </span>
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
const debugInfo = ref(false); // Tắt debug mặc định

const getCountByStatus = (status) => {
  return approvedRequests.value.filter((request) => request.status === status)
    .length;
};

// Kiểm tra xem sách có quá hạn không
const isOverdue = (request) => {
  if (request.status === "returned") return false;

  const today = new Date();
  const dueDate = new Date(request.NgayTraDuKien);
  return dueDate < today;
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

    // Xử lý dữ liệu trả về: kiểm tra và cập nhật trạng thái quá hạn
    approvedRequests.value = response.map((request) => {
      // Nếu đã trả thì giữ nguyên trạng thái
      if (request.status === "returned") {
        return request;
      }

      // Nếu chưa trả, kiểm tra xem có quá hạn không
      const today = new Date();
      const dueDate = new Date(request.NgayTraDuKien);

      if (dueDate < today) {
        return { ...request, status: "overdue" };
      }

      return request;
    });

    console.log("✅ Approved requests loaded:", approvedRequests.value.length);
    console.log(
      "📊 Request statuses:",
      approvedRequests.value.map((r) => ({
        id: r._id,
        status: r.status,
        returned: r.NgayTraThucTe,
      }))
    );
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

    // Gọi API đánh dấu đã trả
    const updatedRequest = await adminService.returnBorrow(
      adminStore.token,
      requestId
    );

    console.log("✅ Request marked as returned:", updatedRequest);
    alert("✅ Đã đánh dấu sách đã được trả!");

    // Cập nhật cục bộ thay vì tải lại toàn bộ
    const index = approvedRequests.value.findIndex((r) => r._id === requestId);
    if (index !== -1) {
      // Cập nhật trạng thái và ngày trả thực tế
      approvedRequests.value[index] = {
        ...approvedRequests.value[index],
        status: "returned",
        NgayTraThucTe: new Date().toISOString(),
      };

      console.log("🔄 Locally updated request:", approvedRequests.value[index]);
    }

    // Hoặc tải lại toàn bộ danh sách nếu muốn
    // await loadApprovedRequests();
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
  padding: 0.35em 0.65em;
}
</style>
