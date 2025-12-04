<template>
  <div class="sach-detail-page py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-10">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Đang tải thông tin sách...</p>
          </div>

          <div v-else-if="error" class="alert alert-danger">
            <i class="fas fa-exclamation-triangle me-2"></i>
            {{ error }}
          </div>

          <div v-else-if="book" class="card shadow border-0">
            <div class="card-body p-4">
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                  <li class="breadcrumb-item">
                    <router-link to="/sach" class="text-decoration-none">
                      <i class="fas fa-book me-1"></i>Danh sách sách
                    </router-link>
                  </li>
                  <li class="breadcrumb-item active" aria-current="page">
                    {{ book.TenSach }}
                  </li>
                </ol>
              </nav>

              <div class="row">
                <div class="col-md-4 text-center mb-4">
                  <div class="book-cover-container">
                    <img
                      v-if="book.HinhBia"
                      :src="getImageUrl(book.HinhBia)"
                      :alt="book.TenSach"
                      class="book-cover img-fluid rounded shadow"
                    />
                    <div
                      v-else
                      class="book-image-placeholder bg-light rounded p-5"
                    >
                      <i class="fas fa-book-open fa-5x text-primary"></i>
                      <p class="mt-3 text-muted">Chưa có ảnh bìa</p>
                    </div>
                  </div>
                </div>

                <div class="col-md-8">
                  <h1 class="h2 fw-bold text-primary mb-3">
                    {{ book.TenSach }}
                  </h1>

                  <div class="book-meta mb-4">
                    <p class="text-muted mb-2">
                      <i class="fas fa-user-edit me-2"></i>
                      <strong>Tác giả:</strong>
                      {{ book.TacGia || "Đang cập nhật" }}
                    </p>
                    <p class="text-muted mb-2">
                      <i class="fas fa-calendar-alt me-2"></i>
                      <strong>Năm xuất bản:</strong>
                      {{ book.NamXuatBan || "Đang cập nhật" }}
                    </p>
                    <p class="text-muted mb-2">
                      <i class="fas fa-copy me-2"></i>
                      <strong>Số quyển có sẵn:</strong>
                      <span
                        :class="{
                          'text-success': book.SoQuyen > 0,
                          'text-danger': book.SoQuyen <= 0,
                        }"
                      >
                        {{ book.SoQuyen || 0 }}
                      </span>
                    </p>
                    <p class="text-muted mb-2" v-if="book.DonGia">
                      <i class="fas fa-tag me-2"></i>
                      <strong>Giá:</strong> {{ formatCurrency(book.DonGia) }}
                    </p>
                    <p class="text-muted mb-2" v-if="book.MaNXB">
                      <i class="fas fa-building me-2"></i>
                      <strong>NXB:</strong>
                      {{ book.MaNXB.TenNXB || "Đang cập nhật" }}
                    </p>
                    <p class="text-muted mb-2" v-else-if="book.MaNXB">
                      <i class="fas fa-building me-2"></i>
                      <strong>NXB:</strong> Đang cập nhật
                    </p>
                  </div>

                  <div class="book-description mb-4" v-if="book.MoTa">
                    <h5 class="fw-bold text-primary">Mô tả</h5>
                    <p class="text-muted">{{ book.MoTa }}</p>
                  </div>

                  <div class="action-buttons">
                    <router-link
                      v-if="!userStore.user"
                      to="/login"
                      class="btn btn-primary btn-lg me-3"
                    >
                      <i class="fas fa-sign-in-alt me-2"></i>
                      Đăng nhập để mượn
                    </router-link>

                    <button
                      v-else
                      @click="borrow"
                      class="btn btn-primary btn-lg me-3"
                      :disabled="loadingBorrow || !canBorrow"
                    >
                      <span
                        v-if="loadingBorrow"
                        class="spinner-border spinner-border-sm me-2"
                      ></span>
                      <i class="fas fa-hand-holding me-2"></i>
                      {{ borrowButtonText }}
                    </button>

                    <router-link
                      to="/sach"
                      class="btn btn-outline-secondary btn-lg"
                    >
                      <i class="fas fa-arrow-left me-2"></i>Quay lại
                    </router-link>
                  </div>

                  <div
                    v-if="borrowMessage"
                    class="mt-3 alert"
                    :class="borrowMessageClass"
                  >
                    {{ borrowMessage }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-5">
            <i class="fas fa-book fa-3x text-muted mb-3"></i>
            <h3 class="text-muted">Không tìm thấy sách</h3>
            <p class="text-muted mb-4">
              Sách bạn tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <router-link to="/sach" class="btn btn-primary">
              <i class="fas fa-arrow-left me-2"></i>Quay lại danh sách sách
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import sachService from "../services/sachService";
import muonService from "../services/muonService";
import { useUserStore } from "../stores/userStore";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const book = ref(null);
const loading = ref(true);
const loadingBorrow = ref(false);
const error = ref("");
const borrowMessage = ref("");
const borrowMessageClass = ref("");

const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  return `http://localhost:3000${imagePath}`;
};

const canBorrow = computed(() => {
  return userStore.isLoggedIn && book.value?.SoQuyen > 0;
});

const borrowButtonText = computed(() => {
  if (loadingBorrow.value) return "Đang xử lý...";
  if (book.value?.SoQuyen <= 0) return "Hết sách";
  return "Mượn sách";
});

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const borrow = async () => {
  if (!userStore.isLoggedIn) {
    router.push("/login");
    return;
  }

  if (!book.value || book.value.SoQuyen <= 0) {
    borrowMessage.value = "Sách hiện không có sẵn để mượn";
    borrowMessageClass.value = "alert-warning";
    return;
  }

  try {
    loadingBorrow.value = true;
    borrowMessage.value = "";

    const borrowData = {
      MaSach: book.value._id,
      NgayTraDuKien: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 ngày sau
    };

    console.log("Requesting to borrow book:", borrowData);

    const result = await muonService.requestBorrow(borrowData);

    borrowMessage.value =
      "Yêu cầu mượn sách đã được gửi thành công! Vui lòng chờ admin duyệt.";
    borrowMessageClass.value = "alert-success";

    setTimeout(() => {
      loadBook();
    }, 2000);
  } catch (error) {
    console.error("Borrow error:", error);
    borrowMessage.value =
      error.response?.data?.message || "Mượn sách thất bại. Vui lòng thử lại.";
    borrowMessageClass.value = "alert-danger";
  } finally {
    loadingBorrow.value = false;
  }
};

const loadBook = async () => {
  try {
    loading.value = true;
    error.value = "";
    const bookId = route.params.id;
    console.log("Loading book with ID:", bookId);

    book.value = await sachService.getOne(bookId);
    console.log("Book loaded:", book.value);
  } catch (err) {
    console.error("Error loading book:", err);
    error.value = err.response?.data?.message || "Không thể tải thông tin sách";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadBook();
});
</script>

<style scoped>
.sach-detail-page {
  background-color: #f8f9fa;
  min-height: calc(100vh - 76px);
}

.book-cover-container {
  max-width: 300px;
  margin: 0 auto;
}

.book-cover {
  max-height: 400px;
  width: auto;
  border: 1px solid #dee2e6;
}

.book-image-placeholder {
  border: 2px dashed #dee2e6;
  transition: all 0.3s ease;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.book-image-placeholder:hover {
  border-color: var(--primary-color);
  background-color: #e9ecef;
}

.breadcrumb {
  background-color: transparent;
  padding: 0;
  margin-bottom: 2rem;
}

.breadcrumb-item a {
  color: var(--primary-color);
}

.breadcrumb-item.active {
  color: #6c757d;
}

.action-buttons {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.book-meta p {
  margin-bottom: 0.5rem;
}

.alert {
  border: none;
  border-radius: 8px;
}

.card {
  border-radius: 15px;
  overflow: hidden;
}

.btn {
  border-radius: 8px;
  font-weight: 500;
}
</style>
