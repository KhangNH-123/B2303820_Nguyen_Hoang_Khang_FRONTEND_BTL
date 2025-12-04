<template>
  <div class="admin-dashboard py-4">
    <div class="container">
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="h2 fw-bold text-dark">
            <i class="fas fa-tachometer-alt me-2"></i>Trang quản trị Admin
          </h1>
          <p class="text-muted">
            Quản lý hệ thống thư viện và yêu cầu mượn sách
          </p>
        </div>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Đang tải thống kê...</p>
      </div>

      <div v-else class="row">
        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-primary shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div
                    class="text-xs font-weight-bold text-primary text-uppercase mb-1"
                  >
                    Sách đang chờ duyệt
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">
                    {{ stats.pending }}
                  </div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-clock fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-success shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div
                    class="text-xs font-weight-bold text-success text-uppercase mb-1"
                  >
                    Sách đã duyệt
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">
                    {{ stats.approved }}
                  </div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-check-circle fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-info shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div
                    class="text-xs font-weight-bold text-info text-uppercase mb-1"
                  >
                    Tổng số sách
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">
                    {{ stats.totalBooks }}
                  </div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-book fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-warning shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div
                    class="text-xs font-weight-bold text-warning text-uppercase mb-1"
                  >
                    Người dùng
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">
                    {{ stats.totalUsers }}
                  </div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-users fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <h4 class="fw-bold mb-3">Truy cập nhanh</h4>
        </div>

        <div class="col-lg-4 col-md-6 mb-3">
          <router-link
            to="/admin/pending"
            class="card action-card text-decoration-none"
          >
            <div class="card-body text-center p-4">
              <i class="fas fa-clock fa-3x text-warning mb-3"></i>
              <h5 class="card-title fw-bold">Yêu cầu đang chờ</h5>
              <p class="card-text text-muted">
                Duyệt các yêu cầu mượn sách mới
              </p>
            </div>
          </router-link>
        </div>

        <div class="col-lg-4 col-md-6 mb-3">
          <router-link
            to="/admin/manage-sach"
            class="card action-card text-decoration-none"
          >
            <div class="card-body text-center p-4">
              <i class="fas fa-book fa-3x text-primary mb-3"></i>
              <h5 class="card-title fw-bold">Quản lý sách</h5>
              <p class="card-text text-muted">
                Thêm, sửa, xóa sách trong hệ thống
              </p>
            </div>
          </router-link>
        </div>

        <div class="col-lg-4 col-md-6 mb-3">
          <router-link
            to="/admin/borrow-all"
            class="card action-card text-decoration-none"
          >
            <div class="card-body text-center p-4">
              <i class="fas fa-list fa-3x text-success mb-3"></i>
              <h5 class="card-title fw-bold">Tất cả lịch sử mượn</h5>
              <p class="card-text text-muted">
                Xem lịch sử mượn sách toàn hệ thống
              </p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAdminStore } from "../../stores/adminStore";
import adminService from "../../services/adminService";
import statsService from "../../services/statsService";

const adminStore = useAdminStore();
const loading = ref(false);
const stats = ref({
  pending: 0,
  approved: 0,
  totalBooks: 0,
  totalUsers: 0,
});

const loadDashboardStats = async () => {
  try {
    loading.value = true;
    console.log("📊 Loading dashboard statistics...");

    let statsData = null;

    // Thử lấy thống kê từ API
    try {
      statsData = await statsService.getAdminStats();
    } catch (statsError) {
      console.warn("⚠️ Could not load stats, using fallback");
      statsData = {
        totalPendingBorrows: 0,
        totalApprovedBorrows: 0,
        totalReturnedBorrows: 0,
        totalCurrentBorrows: 0,
      };
    }

    // Lấy dữ liệu khác
    const [allBooks, allUsers] = await Promise.all([
      adminService.getAllBooks(adminStore.token),
      adminService.getAllReaders(adminStore.token),
    ]);

    stats.value = {
      pending: statsData.totalPendingBorrows,
      approved: statsData.totalApprovedBorrows, // Tổng lượt đã duyệt (không chỉ đang mượn)
      totalBooks: allBooks.length,
      totalUsers: allUsers.length,
      returned: statsData.totalReturnedBorrows, // Thêm số đã trả
      currentBorrows: statsData.totalCurrentBorrows, // Số đang mượn
    };

    console.log("✅ Dashboard stats loaded:", stats.value);
  } catch (error) {
    console.error("❌ Error loading dashboard stats:", error);
    // Fallback để dashboard vẫn hiển thị
    stats.value = {
      pending: 0,
      approved: 0,
      totalBooks: 0,
      totalUsers: 0,
      returned: 0,
      currentBorrows: 0,
    };
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  console.log("🏁 AdminDashboard mounted");
  console.log("🔐 Admin logged in:", adminStore.isLoggedIn);

  adminStore.initialize();

  if (adminStore.isLoggedIn) {
    loadDashboardStats();
  }
});
</script>

<style scoped>
.admin-dashboard {
  background-color: #f8f9fc;
  min-height: calc(100vh - 76px);
}

.border-left-primary {
  border-left: 0.25rem solid #4e73df !important;
}

.border-left-success {
  border-left: 0.25rem solid #1cc88a !important;
}

.border-left-info {
  border-left: 0.25rem solid #36b9cc !important;
}

.border-left-warning {
  border-left: 0.25rem solid #f6c23e !important;
}

.action-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e3e6f0;
  color: inherit;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
  color: inherit;
}
</style>
