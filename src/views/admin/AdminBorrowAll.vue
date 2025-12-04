<template>
  <div class="admin-borrow-all py-4">
    <div class="container">
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="h2 fw-bold text-dark">
            <i class="fas fa-list me-2"></i>Tất cả bản ghi mượn
          </h1>
          <p class="text-muted">Xem lịch sử mượn sách toàn hệ thống</p>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-6">
                  <label class="form-label fw-bold">Lọc theo trạng thái:</label>
                  <select v-model="filterStatus" class="form-select">
                    <option value="">Tất cả trạng thái</option>
                    <option value="pending">Chờ duyệt</option>
                    <option value="approved">Đang mượn</option>
                    <option value="returned">Đã trả</option>
                    <option value="rejected">Từ chối</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <div class="text-end">
                    <p class="mb-0">
                      <strong>Tổng số bản ghi:</strong>
                      <span class="badge bg-primary">{{
                        filteredBorrows.length
                      }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Đang tải dữ liệu...</p>
      </div>

      <div v-else-if="allBorrows.length === 0" class="text-center py-5">
        <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
        <h4 class="text-muted">Không có bản ghi mượn sách nào</h4>
        <p class="text-muted">Chưa có yêu cầu mượn sách nào trong hệ thống.</p>
      </div>

      <div v-else class="row">
        <div class="col-12">
          <div class="card shadow border-0">
            <div class="card-header bg-dark text-white py-3">
              <h5 class="card-title mb-0">
                <i class="fas fa-history me-2"></i>
                Lịch sử mượn sách
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
                      <th>Ngày mượn</th>
                      <th>Ngày trả</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="record in filteredBorrows" :key="record._id">
                      <td>
                        <strong
                          v-if="
                            record.MaDocGia &&
                            typeof record.MaDocGia === 'object'
                          "
                        >
                          {{ record.MaDocGia.HoLot }} {{ record.MaDocGia.Ten }}
                        </strong>
                        <strong v-else class="text-danger">
                          Lỗi: Không có thông tin độc giả
                        </strong>
                        <br />
                        <small
                          class="text-muted"
                          v-if="record.MaDocGia && record.MaDocGia.email"
                        >
                          {{ record.MaDocGia.email }}
                        </small>
                      </td>
                      <td>
                        <strong
                          v-if="
                            record.MaSach && typeof record.MaSach === 'object'
                          "
                        >
                          {{ record.MaSach.TenSach }}
                        </strong>
                        <strong v-else class="text-danger">
                          Lỗi: Không có thông tin sách
                        </strong>
                        <br />
                        <small
                          class="text-muted"
                          v-if="record.MaSach && record.MaSach.TacGia"
                        >
                          {{ record.MaSach.TacGia }}
                        </small>
                      </td>
                      <td>{{ formatDate(record.createdAt) }}</td>
                      <td>{{ formatDate(record.NgayMuon) }}</td>
                      <td>{{ formatDate(record.NgayTra) }}</td>
                      <td>
                        <span
                          class="badge"
                          :class="getStatusBadgeClass(record.status)"
                        >
                          {{ getStatusText(record.status) }}
                        </span>
                      </td>
                      <td>
                        <button
                          v-if="
                            record.status === 'returned' ||
                            record.status === 'rejected'
                          "
                          @click="deleteRecord(record._id)"
                          class="btn btn-danger btn-sm"
                          :disabled="deletingRecord === record._id"
                          title="Xoá bản ghi này"
                        >
                          <span
                            v-if="deletingRecord === record._id"
                            class="spinner-border spinner-border-sm me-1"
                          ></span>
                          <i class="fas fa-trash"></i>
                        </button>
                        <span v-else class="text-muted small"
                          >Không thể xoá</span
                        >
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

const allBorrows = ref([]);
const loading = ref(false);
const filterStatus = ref("");
const error = ref("");
const deletingRecord = ref("");

const deleteRecord = async (recordId) => {
  if (
    !confirm(
      "⚠️ Bạn có chắc chắn muốn xoá vĩnh viễn bản ghi này?\n\nHành động này không thể hoàn tác!"
    )
  ) {
    return;
  }

  try {
    deletingRecord.value = recordId;
    console.log("🗑️ Deleting borrow record:", recordId);

    const response = await fetch(`http://localhost:3000/api/muon/${recordId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${adminStore.token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Lỗi khi xoá bản ghi");
    }

    alert("✅ Đã xoá bản ghi thành công!");

    await loadAllBorrows();
  } catch (error) {
    console.error("❌ Error deleting record:", error);
    alert("Lỗi khi xoá bản ghi: " + error.message);
  } finally {
    deletingRecord.value = "";
  }
};

const filteredBorrows = computed(() => {
  if (!filterStatus.value) return allBorrows.value;
  return allBorrows.value.filter(
    (record) => record.status === filterStatus.value
  );
});

const loadAllBorrows = async () => {
  try {
    loading.value = true;
    error.value = "";
    console.log("🔄 Loading all borrow records...");

    if (!adminStore.isLoggedIn) {
      error.value = "Vui lòng đăng nhập để tiếp tục";
      loading.value = false;
      return;
    }

    console.log("🔐 Admin is logged in, token exists");
    console.log("📝 Calling adminService.getAllBorrows...");

    const response = await adminService.getAllBorrows(adminStore.token);
    allBorrows.value = response;

    console.log(
      "✅ All borrow records loaded successfully:",
      allBorrows.value.length
    );
  } catch (err) {
    console.error("❌ Error loading all borrow records:", err);
    console.error("❌ Error message:", err.message);
    console.error("❌ Error code:", err.code);

    if (err.message.includes("No admin token") || err.code === "NO_TOKEN") {
      error.value = "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.";
      setTimeout(() => {
        router.push("/admin/login");
      }, 3000);
    } else if (err.response?.status === 401) {
      error.value = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
      setTimeout(() => {
        router.push("/admin/login");
      }, 3000);
    } else {
      error.value =
        "Lỗi khi tải tất cả bản ghi mượn: " +
        (err.response?.data?.message || err.message || "Lỗi không xác định");
    }
  } finally {
    loading.value = false;
  }
};

const getStatusBadgeClass = (status) => {
  const classes = {
    pending: "bg-warning",
    approved: "bg-success",
    returned: "bg-info",
    rejected: "bg-danger",
  };
  return classes[status] || "bg-secondary";
};

const getStatusText = (status) => {
  const texts = {
    pending: "Chờ duyệt",
    approved: "Đang mượn",
    returned: "Đã trả",
    rejected: "Từ chối",
  };
  return texts[status] || status;
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
  loadAllBorrows();
});
</script>

<style scoped>
.admin-borrow-all {
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

.form-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(44, 62, 80, 0.25);
}
</style>
