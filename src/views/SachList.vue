<template>
  <div class="sach-list-page py-5">
    <div class="container">
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <h1 class="h2 fw-bold text-primary">
              <i class="fas fa-book-open me-2"></i>Danh sách sách
            </h1>
            <div class="search-box">
              <div class="input-group">
                <input
                  v-model="searchQuery"
                  type="text"
                  class="form-control"
                  placeholder="Tìm kiếm sách"
                  @input="searchBooks"
                />
                <button class="btn btn-outline-primary" @click="searchBooks">
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>
          <p class="text-muted">Khám phá kho sách đa dạng của thư viện</p>
        </div>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Đang tải danh sách sách...</p>
      </div>

      <div v-else-if="filteredBooks.length === 0" class="text-center py-5">
        <i class="fas fa-book fa-3x text-muted mb-3"></i>
        <h4 class="text-muted mb-3">Không tìm thấy sách</h4>
        <p class="text-muted mb-4" v-if="searchQuery">
          Không có kết quả phù hợp với "{{ searchQuery }}"
        </p>
        <p class="text-muted mb-4" v-else>
          Hiện chưa có sách nào trong hệ thống.
        </p>
        <button @click="clearSearch" class="btn btn-primary" v-if="searchQuery">
          <i class="fas fa-undo me-2"></i>Xem tất cả sách
        </button>
      </div>

      <div v-else class="row">
        <div
          v-for="book in filteredBooks"
          :key="book._id"
          class="col-xl-3 col-lg-4 col-md-6 mb-4"
        >
          <BookCard :book="book" @bookBorrowed="handleBookBorrowed" />
        </div>
      </div>

      <div class="row mt-4" v-if="filteredBooks.length > 0">
        <div class="col-12">
          <div
            class="alert alert-info d-flex justify-content-between align-items-center"
          >
            <div>
              <i class="fas fa-info-circle me-2"></i>
              Hiển thị <strong>{{ filteredBooks.length }}</strong> sách trong
              tổng số <strong>{{ books.length }}</strong>
            </div>
            <div class="small text-muted">
              <i class="fas fa-check-circle me-1"></i>
              <span class="text-success">{{ availableBooksCount }}</span> sách
              có sẵn
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import BookCard from "../components/BookCard.vue";
import sachService from "../services/sachService";
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();
const books = ref([]);
const loading = ref(true);
const searchQuery = ref("");

const loadBooks = async () => {
  try {
    loading.value = true;
    console.log("📚 Loading books...");

    books.value = await sachService.getAll();
    console.log("✅ Books loaded:", books.value.length);
  } catch (error) {
    console.error("❌ Error loading books:", error);
  } finally {
    loading.value = false;
  }
};

const searchBooks = async () => {
  if (!searchQuery.value.trim()) {
    return;
  }

  try {
    loading.value = true;
    const results = await sachService.search(searchQuery.value);
    books.value = results;
  } catch (error) {
    console.error("Error searching books:", error);
  } finally {
    loading.value = false;
  }
};

const clearSearch = () => {
  searchQuery.value = "";
  loadBooks();
};

const handleBookBorrowed = (bookId) => {
  console.log("Book borrowed:", bookId);
  const bookIndex = books.value.findIndex((b) => b._id === bookId);
  if (bookIndex !== -1) {
    books.value[bookIndex].SoQuyen -= 1;
  }
};

const filteredBooks = computed(() => {
  if (!searchQuery.value.trim()) {
    return books.value;
  }

  const query = searchQuery.value.toLowerCase();
  return books.value.filter(
    (book) =>
      book.TenSach?.toLowerCase().includes(query) ||
      book.TacGia?.toLowerCase().includes(query) ||
      book.MoTa?.toLowerCase().includes(query) ||
      book.MaNXB?.TenNXB?.toLowerCase().includes(query)
  );
});

const availableBooksCount = computed(() => {
  return books.value.filter((book) => book.SoQuyen > 0).length;
});

onMounted(() => {
  loadBooks();
});
</script>

<style scoped>
.sach-list-page {
  background-color: #f8f9fa;
  min-height: calc(100vh - 76px);
}

.search-box {
  max-width: 300px;
}

.input-group input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(44, 62, 80, 0.25);
}

@media (max-width: 768px) {
  .search-box {
    max-width: 100%;
    margin-top: 1rem;
  }

  .d-flex {
    flex-direction: column;
    align-items: flex-start !important;
  }

  h1 {
    margin-bottom: 1rem;
  }
}
</style>
