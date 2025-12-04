<template>
  <div class="home-page">
    <section class="hero-section py-5 mb-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold text-primary mb-3">
              <i class="fas fa-book-open me-2"></i>
              Thư Viện Online
            </h1>
            <p class="lead text-muted mb-4">
              Khám phá hàng ngàn đầu sách đa dạng. Mượn sách dễ dàng, trả sách
              thuận tiện ngay tại nhà.
            </p>
            <div class="hero-buttons">
              <router-link to="/sach" class="btn btn-primary btn-lg me-3">
                <i class="fas fa-search me-2"></i>
                Khám phá sách
              </router-link>
              <router-link
                v-if="!userStore.isLoggedIn"
                to="/register"
                class="btn btn-outline-primary btn-lg"
              >
                <i class="fas fa-user-plus me-2"></i>
                Đăng ký ngay
              </router-link>
            </div>
          </div>
          <div class="col-lg-6 text-center">
            <img
              src="https://cdn.pixabay.com/photo/2015/11/19/21/10/glasses-1052010_1280.jpg"
              alt="Thư viện"
              class="img-fluid rounded shadow"
              style="max-height: 350px"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="stats-section py-4 bg-light mb-5">
      <div class="container">
        <div class="row text-center">
          <div class="col-md-3 col-6 mb-3">
            <div class="stat-item">
              <div class="stat-number text-primary fw-bold display-6">
                {{ stats.totalBooks || 0 }}
              </div>
              <div class="stat-label text-muted">Sách trong kho</div>
            </div>
          </div>
          <div class="col-md-3 col-6 mb-3">
            <div class="stat-item">
              <div class="stat-number text-success fw-bold display-6">
                {{ stats.availableBooks || 0 }}
              </div>
              <div class="stat-label text-muted">Sách có sẵn</div>
            </div>
          </div>
          <div class="col-md-3 col-6 mb-3">
            <div class="stat-item">
              <div class="stat-number text-warning fw-bold display-6">
                {{ stats.totalReaders || 0 }}
              </div>
              <div class="stat-label text-muted">Độc giả</div>
            </div>
          </div>
          <div class="col-md-3 col-6 mb-3">
            <div class="stat-item">
              <div class="stat-number text-info fw-bold display-6">
                {{ stats.totalBorrows || 0 }}
              </div>
              <div class="stat-label text-muted">Lượt mượn</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <p id="Luuy">
      <strong
        >Lưu ý: Nếu sách có hư hại trong quá trình mượn sẽ phải bồi thường giá
        trị tương đương với giá sách mới</strong
      >
    </p>

    <section class="new-books-section py-4 mb-5">
      <div class="container">
        <div class="section-header mb-4">
          <h2 class="h3 fw-bold text-dark">
            <i class="fas fa-star me-2 text-warning"></i>
            Sách Mới Cập Nhật
          </h2>
          <p class="text-muted">
            Những cuốn sách mới nhất được thêm vào hệ thống
          </p>
        </div>

        <BookCarousel
          :books="newBooks"
          title="Sách Mới Cập Nhật"
          emptyMessage="Chưa có sách mới nào"
          @view-more="goToBookList"
        />
      </div>
    </section>

    <section class="featured-books-section py-4 mb-5">
      <div class="container">
        <div class="section-header mb-4">
          <h2 class="h3 fw-bold text-dark">
            <i class="fas fa-fire me-2 text-danger"></i>
            Sách Nổi Bật
          </h2>
          <p class="text-muted">Những cuốn sách được yêu thích nhất</p>
        </div>

        <BookCarousel
          :books="featuredBooks"
          title="Sách Nổi Bật"
          emptyMessage="Chưa có sách nổi bật nào"
          @view-more="goToBookList"
        />
      </div>
    </section>

    <section class="quick-actions-section py-5 bg-primary text-white">
      <div class="container">
        <div class="row">
          <div class="col-md-4 mb-4">
            <div class="text-center">
              <i class="fas fa-book fa-3x mb-3"></i>
              <h4>Mượn Sách Dễ Dàng</h4>
              <p class="mb-0">Chỉ vài click để mượn sách yêu thích</p>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="text-center">
              <i class="fas fa-clock fa-3x mb-3"></i>
              <h4>Quản Lý Thời Gian</h4>
              <p class="mb-0">Theo dõi lịch sử mượn và hạn trả</p>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="text-center">
              <i class="fas fa-headset fa-3x mb-3"></i>
              <h4>Hỗ Trợ 24/7</h4>
              <p class="mb-0">Đội ngũ hỗ trợ luôn sẵn sàng giúp bạn</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import BookCarousel from "../components/BookCarousel.vue";
import sachService from "../services/sachService";
import statsService from "../services/statsService";

const userStore = useUserStore();
const router = useRouter();

const newBooks = ref([]);
const featuredBooks = ref([]);
const stats = ref({
  totalBooks: 0,
  availableBooks: 0,
  totalReaders: 0,
  totalBorrows: 0,
});
const loading = ref(false);

const loadHomeData = async () => {
  try {
    loading.value = true;

    // Lấy danh sách sách
    const allBooks = await sachService.getAll();

    // Cập nhật danh sách sách trước
    newBooks.value = [...allBooks]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 15);

    featuredBooks.value = [...allBooks]
      .filter((book) => book.NamXuatBan >= 2023 || book.SoQuyen > 5)
      .slice(0, 15);

    // Thử lấy thống kê từ API mới
    try {
      const statsData = await statsService.getStats();

      // Sử dụng dữ liệu thống kê từ API
      stats.value = {
        totalBooks: statsData.totalBooks,
        availableBooks: statsData.availableBooks,
        totalReaders: statsData.totalReaders,
        totalBorrows: statsData.totalBorrows,
      };
    } catch (statsError) {
      console.warn("⚠️ Could not load stats, using fallback data");
      // Fallback nếu API stats lỗi
      stats.value = {
        totalBooks: allBooks.length,
        availableBooks: allBooks.filter((book) => book.SoQuyen > 0).length,
        totalReaders: 0,
        totalBorrows: 0,
      };
    }
  } catch (error) {
    console.error("Error loading home data:", error);
    // Fallback cuối cùng
    stats.value = {
      totalBooks: 0,
      availableBooks: 0,
      totalReaders: 0,
      totalBorrows: 0,
    };
  } finally {
    loading.value = false;
  }
};

const goToBookList = () => {
  router.push("/sach");
};

onMounted(() => {
  loadHomeData();
});
</script>

<style scoped>
.home-page {
  padding-bottom: 3rem;
}

.hero-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 0 0 2rem 2rem;
}

.hero-buttons .btn {
  padding: 0.75rem 2rem;
  border-radius: 50px;
}

.stat-item {
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
}

.stat-number {
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.section-header {
  position: relative;
}

.section-header::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #4e73df, #1cc88a);
  border-radius: 2px;
}

.quick-actions-section {
  border-radius: 2rem 2rem 0 0;
}

.quick-actions-section i {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .hero-section {
    text-align: center;
    padding: 3rem 1rem;
  }

  .display-4 {
    font-size: 2.5rem;
  }

  .stat-number.display-6 {
    font-size: 2rem;
  }
}
</style>
