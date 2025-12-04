<template>
  <div class="user-borrow-list-page py-5">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="h2 fw-bold text-primary">
              <i class="fas fa-list me-2"></i>Sách đã mượn
            </h1>
            <router-link to="/sach" class="btn btn-outline-primary">
              <i class="fas fa-book me-2"></i>Mượn thêm sách
            </router-link>
          </div>
          <p class="text-muted">Theo dõi lịch sử mượn sách của bạn</p>
        </div>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Đang tải danh sách sách đã mượn...</p>
      </div>

      <div v-else-if="error" class="alert alert-danger">
        <i class="fas fa-exclamation-triangle me-2"></i>
        {{ error }}
      </div>

      <div v-else-if="borrowList.length === 0" class="text-center py-5">
        <i class="fas fa-book-open fa-3x text-muted mb-3"></i>
        <h4 class="text-muted mb-3">Chưa có sách nào được mượn</h4>
        <p class="text-muted mb-4">Hãy mượn sách để bắt đầu đọc nhé!</p>
        <router-link to="/sach" class="btn btn-primary btn-lg">
          <i class="fas fa-search me-2"></i>Khám phá sách ngay
        </router-link>
      </div>

      <div v-else class="row">
        <div class="col-12">
          <div class="card mb-4">
            <div class="card-body">
              <ul class="nav nav-pills">
                <li class="nav-item">
                  <button
                    class="nav-link"
                    :class="{ active: filterStatus === '' }"
                    @click="filterStatus = ''"
                  >
                    Tất cả ({{ borrowList.length }})
                  </button>
                </li>
                <li class="nav-item">
                  <button
                    class="nav-link"
                    :class="{ active: filterStatus === 'pending' }"
                    @click="filterStatus = 'pending'"
                  >
                    Chờ duyệt ({{ getCountByStatus("pending") }})
                  </button>
                </li>
                <li class="nav-item">
                  <button
                    class="nav-link"
                    :class="{ active: filterStatus === 'approved' }"
                    @click="filterStatus = 'approved'"
                  >
                    Đang mượn ({{ getCountByStatus("approved") }})
                  </button>
                </li>
                <li class="nav-item">
                  <button
                    class="nav-link"
                    :class="{ active: filterStatus === 'returned' }"
                    @click="filterStatus = 'returned'"
                  >
                    Đã trả ({{ getCountByStatus("returned") }})
                  </button>
                </li>
                <li class="nav-item">
                  <button
                    class="nav-link"
                    :class="{ active: filterStatus === 'rejected' }"
                    @click="filterStatus = 'rejected'"
                  >
                    Từ chối ({{ getCountByStatus("rejected") }})
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div class="row">
            <div
              v-for="borrow in filteredBorrows"
              :key="borrow._id"
              class="col-lg-6 mb-4"
            >
              <div class="card h-100 shadow-sm border-0">
                <div class="card-body">
                  <div
                    class="d-flex justify-content-between align-items-start mb-3"
                  >
                    <h5 class="card-title text-primary fw-bold">
                      {{ borrow.MaSach?.TenSach || "Đang tải..." }}
                    </h5>
                    <span
                      class="badge"
                      :class="getStatusBadgeClass(borrow.status)"
                    >
                      {{ getStatusText(borrow.status) }}
                    </span>
                  </div>

                  <div class="book-info mb-3">
                    <p class="text-muted mb-1" v-if="borrow.MaSach?.TacGia">
                      <i class="fas fa-user-edit me-2"></i>
                      <strong>Tác giả:</strong> {{ borrow.MaSach.TacGia }}
                    </p>
                    <p class="text-muted mb-1">
                      <i class="fas fa-calendar-alt me-2"></i>
                      <strong>Ngày yêu cầu:</strong>
                      {{ formatDate(borrow.createdAt) }}
                    </p>
                    <p class="text-muted mb-1" v-if="borrow.NgayMuon">
                      <i class="fas fa-hand-holding me-2"></i>
                      <strong>Ngày mượn:</strong>
                      {{ formatDate(borrow.NgayMuon) }}
                    </p>
                    <p class="text-muted mb-1" v-if="borrow.NgayTraDuKien">
                      <i class="fas fa-flag me-2"></i>
                      <strong>Hạn trả:</strong>
                      {{ formatDate(borrow.NgayTraDuKien) }}
                    </p>
                    <p class="text-muted mb-1" v-if="borrow.NgayTra">
                      <i class="fas fa-undo me-2"></i>
                      <strong>Ngày trả:</strong>
                      {{ formatDate(borrow.NgayTra) }}
                    </p>
                  </div>

                  <div class="action-buttons mt-3 pt-3 border-top">
                    <div class="row g-2">
                      <div class="col-6">
                        <router-link
                          v-if="borrow.MaSach?._id"
                          :to="'/sach/' + borrow.MaSach._id"
                          class="btn btn-outline-primary w-100 btn-sm"
                        >
                          <i class="fas fa-eye me-1"></i>Xem sách
                        </router-link>
                      </div>
                      <div class="col-6">
                        <button
                          v-if="borrow.status === 'approved'"
                          @click="returnBook(borrow._id)"
                          class="btn btn-success w-100 btn-sm"
                          :disabled="processingReturn === borrow._id"
                        >
                          <span
                            v-if="processingReturn === borrow._id"
                            class="spinner-border spinner-border-sm me-1"
                          ></span>
                          <i class="fas fa-undo me-1"></i>Trả sách
                        </button>
                        <button
                          v-else-if="borrow.status === 'pending'"
                          class="btn btn-outline-secondary w-100 btn-sm"
                          disabled
                        >
                          <i class="fas fa-clock me-1"></i>Chờ duyệt
                        </button>
                        <button
                          v-else-if="borrow.status === 'rejected'"
                          class="btn btn-outline-danger w-100 btn-sm"
                          disabled
                        >
                          <i class="fas fa-times me-1"></i>Đã từ chối
                        </button>
                        <button
                          v-else
                          class="btn btn-outline-success w-100 btn-sm"
                          disabled
                        >
                          <i class="fas fa-check me-1"></i>Hoàn thành
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
import { useUserStore } from "../stores/userStore";
import { useRouter } from "vue-router";
import muonService from "../services/muonService";

const userStore = useUserStore();
const router = useRouter();

const borrowList = ref([]);
const loading = ref(false);
const error = ref("");
const filterStatus = ref("");
const processingReturn = ref("");

const filteredBorrows = computed(() => {
  if (!filterStatus.value) return borrowList.value;
  return borrowList.value.filter(
    (borrow) => borrow.status === filterStatus.value
  );
});

const loadBorrowList = async () => {
  if (!userStore.user) {
    router.push("/login");
    return;
  }

  try {
    loading.value = true;
    error.value = "";
    console.log("📚 Loading user borrow list...");

    const borrows = await muonService.getUserBorrows();
    borrowList.value = borrows;

    console.log("✅ Borrow list loaded:", borrowList.value);
  } catch (err) {
    console.error("❌ Error loading borrow list:", err);
    error.value =
      "Không thể tải danh sách sách đã mượn: " +
      (err.response?.data?.message || err.message);
  } finally {
    loading.value = false;
  }
};

const returnBook = async (borrowId) => {
  if (!confirm("Bạn có chắc chắn muốn trả sách này không?")) {
    return;
  }

  try {
    processingReturn.value = borrowId;
    console.log("🔄 Attempting to return book:", borrowId);

    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      throw new Error("Vui lòng đăng nhập lại để thực hiện thao tác này.");
    }

    const result = await muonService.returnBook(borrowId);

    alert("✅ Đã gửi yêu cầu trả sách thành công!");
    console.log("✅ Return result:", result);

    await loadBorrowList();
  } catch (err) {
    console.error("❌ Error returning book:", err);

    let errorMessage = "Lỗi khi trả sách: ";

    if (err.message.includes("token") || err.message.includes("đăng nhập")) {
      errorMessage = err.message;
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else if (err.response?.data?.message) {
      errorMessage += err.response.data.message;
    } else {
      errorMessage += err.message;
    }

    alert(errorMessage);
  } finally {
    processingReturn.value = "";
  }
};

const getCountByStatus = (status) => {
  return borrowList.value.filter((borrow) => borrow.status === status).length;
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
  if (userStore.user) {
    loadBorrowList();
  } else {
    router.push("/login");
  }
});
</script>

<style scoped>
.user-borrow-list-page {
  background-color: #f8f9fa;
  min-height: calc(100vh - 76px);
}

.nav-pills .nav-link {
  color: #6c757d;
  font-weight: 500;
  border-radius: 20px;
  margin-right: 0.5rem;
}

.nav-pills .nav-link.active {
  background-color: var(--primary-color);
  color: white;
}

.card {
  border-radius: 10px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.badge {
  font-size: 0.75rem;
  font-weight: 500;
}

.book-info p {
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.action-buttons .btn {
  border-radius: 6px;
  font-size: 0.875rem;
}
</style>
