<template>
  <div class="book-card card shadow-sm h-100">
    <div class="book-image-container">
      <img
        v-if="book.HinhBia"
        :src="getImageUrl(book.HinhBia)"
        :alt="book.TenSach"
        class="book-cover card-img-top"
      />
      <div v-else class="book-image-placeholder">
        <i class="fas fa-book fa-3x text-muted"></i>
        <p class="text-muted small mt-2">Chưa có ảnh bìa</p>
      </div>
    </div>

    <div class="card-body d-flex flex-column">
      <div class="book-meta mb-2">
        <span class="badge bg-secondary small">{{
          book.MaSach || "Chưa có mã"
        }}</span>
        <span
          class="badge ms-1"
          :class="book.SoQuyen > 0 ? 'bg-success' : 'bg-danger'"
        >
          {{ book.SoQuyen > 0 ? "Có sẵn" : "Hết sách" }}
        </span>
      </div>

      <h5 class="card-title text-primary fw-bold">{{ book.TenSach }}</h5>

      <p class="card-text text-muted mb-2">
        <i class="fas fa-user-edit me-1"></i>
        {{ book.TacGia || "Đang cập nhật" }}
      </p>

      <div class="book-price mb-3">
        <span class="fw-bold text-success">{{
          formatCurrency(book.DonGia)
        }}</span>
      </div>

      <div class="book-details small text-muted mb-3">
        <p class="mb-1" v-if="book.MaNXB?.TenNXB">
          <i class="fas fa-building me-1"></i>
          {{ book.MaNXB.TenNXB }}
        </p>
        <p class="mb-0" v-if="book.NamXuatBan">
          <i class="fas fa-calendar-alt me-1"></i>
          Năm: {{ book.NamXuatBan }}
        </p>
      </div>

      <div class="action-buttons mt-auto">
        <div class="row g-2">
          <div class="col-6">
            <router-link
              :to="'/sach/' + book._id"
              class="btn btn-outline-primary w-100"
            >
              <i class="fas fa-eye me-1"></i>Chi tiết
            </router-link>
          </div>
          <div class="col-6">
            <button
              @click="borrowBook"
              class="btn btn-primary w-100"
              :disabled="!canBorrow"
              :title="borrowTooltip"
            >
              <i class="fas fa-hand-holding me-1"></i>Mượn
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="borrowMessage" class="card-footer">
      <div class="alert alert-sm mb-0" :class="borrowMessageClass">
        <i :class="borrowMessageIcon" class="me-1"></i>
        {{ borrowMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import muonService from "../services/muonService";

const props = defineProps({
  book: Object,
});

const router = useRouter();
const userStore = useUserStore();

const loadingBorrow = ref(false);
const borrowMessage = ref("");
const borrowMessageClass = ref("");
const borrowMessageIcon = ref("");

const canBorrow = computed(() => {
  return userStore.isLoggedIn && props.book?.SoQuyen > 0;
});

const borrowTooltip = computed(() => {
  if (!userStore.isLoggedIn) return "Vui lòng đăng nhập để mượn sách";
  if (props.book?.SoQuyen <= 0) return "Sách đã hết";
  return "Mượn sách này";
});

const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  return `${baseUrl}${imagePath}`;
};

const formatCurrency = (amount) => {
  if (!amount) return "Miễn phí";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const borrowBook = async () => {
  if (!userStore.isLoggedIn) {
    router.push("/login");
    return;
  }

  if (!props.book || props.book.SoQuyen <= 0) {
    showBorrowMessage(
      "Sách hiện không có sẵn để mượn",
      "warning",
      "fa-exclamation-triangle"
    );
    return;
  }

  try {
    loadingBorrow.value = true;
    borrowMessage.value = "";

    const borrowData = {
      MaSach: props.book._id,
      NgayTraDuKien: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    };

    console.log("Requesting to borrow book:", borrowData);

    const result = await muonService.requestBorrow(borrowData);

    showBorrowMessage(
      "Yêu cầu mượn sách đã được gửi thành công! Vui lòng chờ admin duyệt.",
      "success",
      "fa-check-circle"
    );

    emit("bookBorrowed", props.book._id);
  } catch (error) {
    console.error("Borrow error:", error);
    showBorrowMessage(
      error.response?.data?.message || "Mượn sách thất bại. Vui lòng thử lại.",
      "danger",
      "fa-exclamation-circle"
    );
  } finally {
    loadingBorrow.value = false;
  }
};

const showBorrowMessage = (message, type, icon) => {
  borrowMessage.value = message;
  borrowMessageClass.value = `alert-${type}`;
  borrowMessageIcon.value = `fas ${icon}`;

  setTimeout(() => {
    borrowMessage.value = "";
  }, 5000);
};

const emit = defineEmits(["bookBorrowed"]);

const handleImageError = (event) => {
  event.target.src =
    "data:image/svg+xml;base64," +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="150" height="200" viewBox="0 0 150 200">
      <rect width="150" height="200" fill="#f8f9fa"/>
      <text x="50%" y="50%" font-family="Arial" font-size="12" fill="#6c757d" text-anchor="middle" dy=".3em">
        No Image
      </text>
    </svg>
  `);
  event.target.onerror = null;
};
</script>

<style scoped>
.book-card {
  border: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  height: 100%;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
}

.book-image-container {
  height: 220px;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.book-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.book-card:hover .book-cover {
  transform: scale(1.05);
}

.book-image-placeholder {
  text-align: center;
  color: #6c757d;
  padding: 2rem;
}

.card-body {
  padding: 1.25rem;
}

.card-title {
  font-size: 1rem;
  line-height: 1.3;
  height: 2.6rem;
  overflow: hidden;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.book-price {
  font-size: 1.1rem;
}

.book-details p {
  margin-bottom: 0.25rem;
}

.action-buttons .btn {
  border-radius: 6px;
  font-size: 0.875rem;
  padding: 0.375rem 0.5rem;
}

.card-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.125);
  background-color: transparent;
  padding: 0.75rem 1.25rem;
}

.alert-sm {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  margin-bottom: 0;
}
</style>
