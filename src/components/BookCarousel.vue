<template>
  <div class="book-carousel">
    <div class="carousel-container position-relative">
      <button
        v-if="currentPage > 0"
        @click="prevPage"
        class="carousel-nav-btn prev-btn"
        :disabled="loading"
        title="Xem sách trước"
      >
        <i class="fas fa-chevron-left"></i>
      </button>

      <div class="books-grid">
        <div v-for="book in visibleBooks" :key="book._id" class="book-item">
          <div class="carousel-book-card">
            <div class="book-image">
              <img
                v-if="book.HinhBia"
                :src="getImageUrl(book.HinhBia)"
                :alt="book.TenSach"
                @error="handleImageError"
              />
              <div v-else class="no-image">
                <i class="fas fa-book fa-2x text-muted"></i>
              </div>
            </div>

            <div class="book-info">
              <h6 class="book-title">{{ book.TenSach }}</h6>
              <p class="book-author text-muted small">
                <i class="fas fa-user-edit me-1"></i>
                {{ book.TacGia || "Đang cập nhật" }}
              </p>
              <div class="book-price">
                <span class="price">{{ formatCurrency(book.DonGia) }}</span>
              </div>
              <div class="book-actions">
                <router-link
                  :to="'/sach/' + book._id"
                  class="btn btn-sm btn-outline-primary"
                >
                  <i class="fas fa-eye me-1"></i>Chi tiết
                </router-link>
                <button
                  @click="borrowBook(book)"
                  class="btn btn-sm btn-primary"
                  :disabled="!canBorrow(book)"
                  :title="getBorrowTooltip(book)"
                >
                  <i class="fas fa-hand-holding me-1"></i>Mượn
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="showViewMoreButton" class="book-item">
          <div class="view-more-card" @click="$emit('view-more')">
            <div class="view-more-content">
              <i class="fas fa-arrow-right fa-3x mb-3"></i>
              <h5 class="fw-bold">Xem Thêm Sách</h5>
              <p class="text-muted small">Khám phá toàn bộ kho sách</p>
              <button class="btn btn-primary mt-2">
                <i class="fas fa-search me-1"></i>Xem tất cả
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        v-if="hasNextPage"
        @click="nextPage"
        class="carousel-nav-btn next-btn"
        :disabled="loading"
        title="Xem sách tiếp theo"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <div v-if="totalPages > 1" class="page-indicators mt-4">
      <div
        v-for="page in totalPages"
        :key="page"
        class="page-indicator"
        :class="{ active: page - 1 === currentPage }"
        @click="goToPage(page - 1)"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";

const props = defineProps({
  books: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: "Sách",
  },
  emptyMessage: {
    type: String,
    default: "Chưa có sách nào",
  },
});

const emit = defineEmits(["view-more"]);

const userStore = useUserStore();
const router = useRouter();

const currentPage = ref(0);
const booksPerPage = 5;
const loading = ref(false);

const totalPages = computed(() => {
  return Math.ceil(props.books.length / booksPerPage);
});

const hasNextPage = computed(() => {
  return currentPage.value < totalPages.value - 1;
});

const visibleBooks = computed(() => {
  const start = currentPage.value * booksPerPage;
  const end = start + booksPerPage;
  return props.books.slice(start, end);
});

const showViewMoreButton = computed(() => {
  return (
    currentPage.value === totalPages.value - 1 &&
    visibleBooks.value.length === booksPerPage
  );
});

const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  return `${baseUrl}${imagePath}`;
};

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

const formatCurrency = (amount) => {
  if (!amount) return "Miễn phí";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const canBorrow = (book) => {
  return userStore.isLoggedIn && book?.SoQuyen > 0;
};

const getBorrowTooltip = (book) => {
  if (!userStore.isLoggedIn) return "Vui lòng đăng nhập để mượn sách";
  if (book?.SoQuyen <= 0) return "Sách đã hết";
  return "Mượn sách này";
};

const borrowBook = async (book) => {
  if (!userStore.isLoggedIn) {
    router.push("/login");
    return;
  }

  if (!book || book.SoQuyen <= 0) {
    alert("Sách hiện không có sẵn để mượn");
    return;
  }

  router.push(`/sach/${book._id}`);
};

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
  }
};

const goToPage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page;
  }
};

onMounted(() => {
  currentPage.value = 0;
});
</script>

<style scoped>
.book-carousel {
  position: relative;
  padding: 1rem 0;
}

.carousel-container {
  display: flex;
  align-items: center;
  min-height: 320px;
}

.carousel-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: var(--primary-color);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-nav-btn:hover:not(:disabled) {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.carousel-nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.prev-btn {
  left: -20px;
}

.next-btn {
  right: -20px;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  width: 100%;
  padding: 0.5rem;
}

.book-item {
  animation: fadeInUp 0.5s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.carousel-book-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.carousel-book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.book-image {
  height: 180px;
  overflow: hidden;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.book-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.carousel-book-card:hover .book-image img {
  transform: scale(1.05);
}

.no-image {
  padding: 2rem;
  color: #6c757d;
  text-align: center;
}

.book-info {
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.book-title {
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.3;
  height: 2.6rem;
  overflow: hidden;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 0.5rem;
}

.book-author {
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  height: 1.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-price {
  margin-bottom: 1rem;
}

.price {
  font-weight: 600;
  color: var(--success-color);
  font-size: 0.9rem;
}

.book-actions {
  margin-top: auto;
  display: flex;
  gap: 0.5rem;
}

.book-actions .btn {
  flex: 1;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}

.view-more-card {
  background: linear-gradient(135deg, var(--primary-color), #3498db);
  border-radius: 12px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 2rem;
}

.view-more-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(44, 62, 80, 0.3);
}

.view-more-content {
  text-align: center;
  color: white;
}

.view-more-content i {
  opacity: 0.9;
}

.view-more-content h5 {
  margin-bottom: 0.5rem;
}

.view-more-content .btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
}

.view-more-content .btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.page-indicators {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.page-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #dee2e6;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-indicator:hover {
  background-color: #adb5bd;
}

.page-indicator.active {
  background-color: var(--primary-color);
  transform: scale(1.2);
}

@media (max-width: 768px) {
  .carousel-nav-btn {
    width: 30px;
    height: 30px;
    font-size: 0.8rem;
  }

  .prev-btn {
    left: -15px;
  }

  .next-btn {
    right: -15px;
  }

  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .book-image {
    height: 150px;
  }

  .book-actions {
    flex-direction: column;
  }
}
</style>
