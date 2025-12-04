<template>
  <div class="admin-manage-sach py-4">
    <div class="container">
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="h2 fw-bold text-dark">
            <i class="fas fa-book me-2"></i>Quản lý sách
          </h1>
          <p class="text-muted">Thêm, sửa, xóa sách trong hệ thống</p>
        </div>
      </div>

      <div class="row mb-5">
        <div class="col-12">
          <div class="card shadow border-0">
            <div class="card-header bg-primary text-white py-3">
              <h5 class="card-title mb-0">
                <i class="fas fa-plus-circle me-2"></i>Thêm sách mới
              </h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="addBook" enctype="multipart/form-data">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Mã sách</label>
                    <input
                      v-model="newBook.MaSach"
                      class="form-control"
                      placeholder="Mã sách (tự động nếu để trống)"
                    />
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label"
                      >Tên sách <span class="text-danger">*</span></label
                    >
                    <input
                      v-model="newBook.TenSach"
                      class="form-control"
                      placeholder="Tên sách"
                      required
                    />
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">Tác giả</label>
                    <input
                      v-model="newBook.TacGia"
                      class="form-control"
                      placeholder="Tác giả"
                    />
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">Năm xuất bản</label>
                    <input
                      v-model="newBook.NamXuatBan"
                      type="number"
                      class="form-control"
                      placeholder="Năm xuất bản"
                    />
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">Đơn giá</label>
                    <input
                      v-model="newBook.DonGia"
                      type="number"
                      class="form-control"
                      placeholder="Đơn giá"
                    />
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label"
                      >Số quyển <span class="text-danger">*</span></label
                    >
                    <input
                      v-model="newBook.SoQuyen"
                      type="number"
                      class="form-control"
                      placeholder="Số quyển"
                      required
                    />
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">Nhà xuất bản</label>
                    <select v-model="newBook.MaNXB" class="form-select">
                      <option value="">-- Chọn NXB --</option>
                      <option
                        v-for="nxb in nxbList"
                        :key="nxb._id"
                        :value="nxb._id"
                      >
                        {{ nxb.TenNXB }}
                      </option>
                    </select>
                  </div>

                  <div class="col-12 mb-3">
                    <label class="form-label">Mô tả</label>
                    <textarea
                      v-model="newBook.MoTa"
                      class="form-control"
                      placeholder="Mô tả sách"
                      rows="3"
                    ></textarea>
                  </div>

                  <div class="col-12 mb-3">
                    <label class="form-label">Ảnh bìa</label>
                    <input
                      type="file"
                      @change="handleFileUpload"
                      class="form-control"
                      accept="image/*"
                      ref="fileInput"
                    />
                    <div class="form-text">
                      Chọn ảnh bìa sách (JPEG, PNG, max 5MB)
                    </div>

                    <div v-if="imagePreview" class="mt-3">
                      <p class="mb-2"><strong>Preview:</strong></p>
                      <img
                        :src="imagePreview"
                        class="img-thumbnail"
                        style="max-height: 200px"
                      />
                    </div>
                  </div>

                  <div class="col-12">
                    <button
                      type="submit"
                      class="btn btn-primary"
                      :disabled="addingBook"
                    >
                      <span
                        v-if="addingBook"
                        class="spinner-border spinner-border-sm me-2"
                      ></span>
                      <i class="fas fa-plus me-2"></i>Thêm sách
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card shadow border-0">
            <div class="card-header bg-secondary text-white py-3">
              <h5 class="card-title mb-0">
                <i class="fas fa-list me-2"></i>
                Danh sách sách ({{ books.length }})
              </h5>
            </div>
            <div class="card-body p-0">
              <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2 text-muted">Đang tải danh sách sách...</p>
              </div>

              <div v-else-if="books.length === 0" class="text-center py-5">
                <i class="fas fa-book fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">Không có sách nào</h4>
                <p class="text-muted">Hãy thêm sách mới vào hệ thống.</p>
              </div>

              <div v-else class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>Ảnh bìa</th>
                      <th>Mã sách</th>
                      <th>Tên sách</th>
                      <th>Tác giả</th>
                      <th>Số quyển</th>
                      <th>Năm XB</th>
                      <th>Đơn giá</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="book in books" :key="book._id">
                      <td>
                        <img
                          v-if="book.HinhBia"
                          :src="getImageUrl(book.HinhBia)"
                          :alt="book.TenSach"
                          class="book-cover-thumbnail"
                          style="width: 60px; height: 80px; object-fit: cover"
                        />
                        <div v-else class="text-muted small">
                          <i class="fas fa-image"></i><br />
                          No image
                        </div>
                      </td>
                      <td>
                        <strong>{{ book.MaSach || "Chưa có" }}</strong>
                      </td>
                      <td>
                        <strong>{{ book.TenSach }}</strong>
                        <br />
                        <small class="text-muted" v-if="book.MoTa"
                          >{{ book.MoTa.substring(0, 50) }}...</small
                        >
                      </td>
                      <td>{{ book.TacGia || "Đang cập nhật" }}</td>
                      <td>
                        <span
                          :class="{
                            'text-success': book.SoQuyen > 0,
                            'text-danger': book.SoQuyen <= 0,
                          }"
                        >
                          {{ book.SoQuyen }}
                        </span>
                      </td>
                      <td>{{ book.NamXuatBan || "N/A" }}</td>
                      <td>
                        {{ book.DonGia ? formatCurrency(book.DonGia) : "N/A" }}
                      </td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <button
                            @click="editBook(book)"
                            class="btn btn-warning"
                            title="Chỉnh sửa thông tin sách"
                          >
                            <i class="fas fa-edit me-1"></i>Sửa
                          </button>
                          <button
                            @click="removeBook(book._id)"
                            class="btn btn-danger"
                            :disabled="deletingBook === book._id"
                            title="Xóa sách khỏi hệ thống"
                          >
                            <span
                              v-if="deletingBook === book._id"
                              class="spinner-border spinner-border-sm me-1"
                            ></span>
                            <i class="fas fa-trash me-1"></i>Xóa
                          </button>
                        </div>
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

  <div v-if="showEditModal" class="modal-backdrop show"></div>
  <div v-if="showEditModal" class="modal fade show d-block">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header bg-warning text-dark">
          <h5 class="modal-title">
            <i class="fas fa-edit me-2"></i>Chỉnh sửa thông tin sách
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="closeEditModal"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveBookEdit" enctype="multipart/form-data">
            <div class="row">
              <div class="col-12 mb-3">
                <label class="form-label fw-bold">Ảnh bìa hiện tại:</label>
                <div class="text-center">
                  <img
                    v-if="editingBook.HinhBia"
                    :src="getImageUrl(editingBook.HinhBia)"
                    :alt="editingBook.TenSach"
                    class="img-thumbnail mb-2"
                    style="max-height: 200px"
                  />
                  <p v-else class="text-muted">Chưa có ảnh bìa</p>
                </div>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Mã sách</label>
                <input
                  v-model="editingBook.MaSach"
                  class="form-control"
                  readonly
                  disabled
                />
                <div class="form-text text-muted">
                  Mã sách không thể thay đổi
                </div>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label"
                  >Tên sách <span class="text-danger">*</span></label
                >
                <input
                  v-model="editingBook.TenSach"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Tác giả</label>
                <input v-model="editingBook.TacGia" class="form-control" />
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Năm xuất bản</label>
                <input
                  v-model="editingBook.NamXuatBan"
                  type="number"
                  class="form-control"
                />
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Đơn giá (VND)</label>
                <input
                  v-model="editingBook.DonGia"
                  type="number"
                  class="form-control"
                />
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label"
                  >Số quyển <span class="text-danger">*</span></label
                >
                <input
                  v-model="editingBook.SoQuyen"
                  type="number"
                  class="form-control"
                  required
                />
                <div class="form-text">
                  <span
                    :class="
                      editingBook.SoQuyen > 0 ? 'text-success' : 'text-danger'
                    "
                  >
                    {{
                      editingBook.SoQuyen > 0 ? "Có sẵn để mượn" : "Hết sách"
                    }}
                  </span>
                </div>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Nhà xuất bản</label>
                <select v-model="editingBook.MaNXB" class="form-select">
                  <option value="">-- Chọn NXB --</option>
                  <option
                    v-for="nxb in nxbList"
                    :key="nxb._id"
                    :value="nxb._id"
                  >
                    {{ nxb.TenNXB }}
                  </option>
                </select>
              </div>

              <div class="col-12 mb-3">
                <label class="form-label">Mô tả</label>
                <textarea
                  v-model="editingBook.MoTa"
                  class="form-control"
                  rows="3"
                ></textarea>
              </div>

              <div class="col-12 mb-3">
                <label class="form-label">Thay đổi ảnh bìa (tùy chọn)</label>
                <input
                  type="file"
                  @change="handleEditFileUpload"
                  class="form-control"
                  accept="image/*"
                  ref="editFileInput"
                />
                <div class="form-text">Để trống nếu giữ nguyên ảnh cũ</div>

                <div v-if="editImagePreview" class="mt-3">
                  <p class="mb-2"><strong>Preview ảnh mới:</strong></p>
                  <img
                    :src="editImagePreview"
                    class="img-thumbnail"
                    style="max-height: 200px"
                  />
                </div>
              </div>

              <div class="col-12 mb-3">
                <div class="alert alert-info">
                  <i class="fas fa-info-circle me-2"></i>
                  <strong>Lưu ý:</strong> Thay đổi thông tin sách sẽ ảnh hưởng
                  đến tất cả bản ghi liên quan.
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeEditModal"
              >
                <i class="fas fa-times me-1"></i>Huỷ
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="savingEdit"
              >
                <span
                  v-if="savingEdit"
                  class="spinner-border spinner-border-sm me-2"
                ></span>
                <i class="fas fa-save me-1"></i>Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showDeleteModal" class="modal-backdrop show"></div>
  <div v-if="showDeleteModal" class="modal fade show d-block">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title">
            <i class="fas fa-exclamation-triangle me-2"></i>Xác nhận xoá sách
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="closeDeleteModal"
          ></button>
        </div>
        <div class="modal-body">
          <p>
            Bạn có chắc chắn muốn xoá sách
            <strong>"{{ deletingBookInfo?.TenSach || "này" }}"</strong> không?
          </p>
          <p class="text-danger">
            <i class="fas fa-exclamation-circle me-1"></i>
            Hành động này không thể hoàn tác!
          </p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="closeDeleteModal"
          >
            <i class="fas fa-times me-1"></i>Huỷ
          </button>
          <button
            type="button"
            class="btn btn-danger"
            @click="confirmDeleteBook"
          >
            <span
              v-if="deletingBook"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            <i class="fas fa-trash me-1"></i>Xoá sách
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAdminStore } from "../../stores/adminStore";
import adminService from "../../services/adminService";
import { useRouter } from "vue-router";

const adminStore = useAdminStore();
const router = useRouter();

const books = ref([]);
const loading = ref(false);
const addingBook = ref(false);
const deletingBook = ref("");
const nxbList = ref([]);
const showDeleteModal = ref(false);
const deletingBookInfo = ref(null);
const deletingBookId = ref("");

const loadNXBList = async () => {
  try {
    console.log("📚 Loading NXB list...");
    const response = await fetch("http://localhost:3000/api/nxb", {
      headers: {
        Authorization: `Bearer ${adminStore.token}`,
      },
    });

    if (response.ok) {
      nxbList.value = await response.json();
      console.log("✅ NXB list loaded:", nxbList.value.length);
    }
  } catch (error) {
    console.error("❌ Error loading NXB list:", error);
  }
};

const showEditModal = ref(false);
const editingBook = ref({
  _id: "",
  MaSach: "",
  TenSach: "",
  TacGia: "",
  NamXuatBan: "",
  DonGia: "",
  SoQuyen: "",
  MaNXB: "",
  MoTa: "",
  HinhBia: "",
});
const savingEdit = ref(false);
const editImagePreview = ref("");
const editSelectedFile = ref(null);
const editFileInput = ref(null);

const imagePreview = ref("");
const selectedFile = ref(null);
const fileInput = ref(null);

const newBook = ref({
  MaSach: "",
  TenSach: "",
  TacGia: "",
  NamXuatBan: "",
  DonGia: "",
  SoQuyen: "",
  MaNXB: "",
  MoTa: "",
});

const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  return `${baseUrl}${imagePath}`;
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleEditFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    editSelectedFile.value = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      editImagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const editBook = (book) => {
  console.log("📝 Editing book:", book);

  let maNXBValue = "";
  if (book.MaNXB) {
    if (typeof book.MaNXB === "object" && book.MaNXB._id) {
      maNXBValue = book.MaNXB._id;
    } else if (typeof book.MaNXB === "string") {
      maNXBValue = book.MaNXB;
    }
  }

  editingBook.value = {
    _id: book._id,
    MaSach: book.MaSach || "",
    TenSach: book.TenSach || "",
    TacGia: book.TacGia || "",
    NamXuatBan: book.NamXuatBan || "",
    DonGia: book.DonGia || "",
    SoQuyen: book.SoQuyen || 0,
    MaNXB: maNXBValue,
    MoTa: book.MoTa || "",
    HinhBia: book.HinhBia || "",
  };

  editImagePreview.value = "";
  editSelectedFile.value = null;
  if (editFileInput.value) {
    editFileInput.value.value = "";
  }

  showEditModal.value = true;
};

const closeEditModal = () => {
  if (savingEdit.value) return;

  showEditModal.value = false;
  editingBook.value = {
    _id: "",
    MaSach: "",
    TenSach: "",
    TacGia: "",
    NamXuatBan: "",
    DonGia: "",
    SoQuyen: "",
    MaNXB: "",
    MoTa: "",
    HinhBia: "",
  };
  editImagePreview.value = "";
  editSelectedFile.value = null;
};

const saveBookEdit = async () => {
  if (!editingBook.value.TenSach || !editingBook.value.SoQuyen) {
    alert("Vui lòng điền tên sách và số quyển");
    return;
  }

  if (!confirm("Bạn có chắc chắn muốn lưu thay đổi cho sách này?")) {
    return;
  }

  try {
    savingEdit.value = true;

    const formData = new FormData();

    const fields = [
      "TenSach",
      "TacGia",
      "NamXuatBan",
      "DonGia",
      "SoQuyen",
      "MaNXB",
      "MoTa",
    ];
    fields.forEach((field) => {
      const value = editingBook.value[field];

      if (value !== undefined && value !== null && value !== "") {
        formData.append(field, value);
      }
    });

    if (editSelectedFile.value) {
      formData.append("HinhBia", editSelectedFile.value);
    }

    console.log("💾 Saving book edit:", editingBook.value._id);
    console.log("📝 FormData fields:");
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }

    const token = adminStore.token;
    console.log("🔐 Token:", token ? "Exists" : "Missing");

    const response = await fetch(
      `http://localhost:3000/api/sach/${editingBook.value._id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    console.log("📤 Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Response error text:", errorText);

      try {
        const errorData = JSON.parse(errorText);
        throw new Error(
          errorData.message || errorData.error || "Lỗi khi cập nhật sách"
        );
      } catch (e) {
        throw new Error(`Lỗi server (${response.status}): ${errorText}`);
      }
    }

    const result = await response.json();
    console.log("✅ Update successful:", result);

    alert("✅ Đã cập nhật thông tin sách thành công!");

    closeEditModal();
    await loadBooks();
  } catch (error) {
    console.error("❌ Error saving book edit:", error);
    console.error("❌ Error stack:", error.stack);
    alert("Lỗi khi cập nhật sách: " + error.message);
  } finally {
    savingEdit.value = false;
  }
};

const loadBooks = async () => {
  try {
    loading.value = true;
    console.log("🔄 Loading books...");

    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("Vui lòng đăng nhập lại");
      router.push("/admin/login");
      return;
    }

    console.log("🔐 Token exists, calling API...");

    const response = await adminService.getAllBooks(adminStore.token);
    books.value = response;

    console.log("✅ Books loaded:", books.value.length);
  } catch (error) {
    console.error("❌ Error loading books:", error);

    if (error.message.includes("No admin token")) {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      router.push("/admin/login");
    } else {
      alert(
        "Lỗi khi tải danh sách sách: " +
          (error.response?.data?.message || error.message)
      );
    }
  } finally {
    loading.value = false;
  }
};

const addBook = async () => {
  if (!newBook.value.TenSach || !newBook.value.SoQuyen) {
    alert("Vui lòng điền tên sách và số quyển");
    return;
  }

  try {
    addingBook.value = true;

    const formData = new FormData();

    Object.keys(newBook.value).forEach((key) => {
      if (newBook.value[key] !== "") {
        formData.append(key, newBook.value[key]);
      }
    });

    if (selectedFile.value) {
      formData.append("HinhBia", selectedFile.value);
    }

    console.log("➕ Adding new book with image...");

    const token = adminStore.token;
    const response = await fetch("http://localhost:3000/api/sach", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Lỗi khi thêm sách");
    }

    const result = await response.json();

    alert("✅ Thêm sách thành công!");

    newBook.value = {
      MaSach: "",
      TenSach: "",
      TacGia: "",
      NamXuatBan: "",
      DonGia: "",
      SoQuyen: "",
      MaNXB: "",
      MoTa: "",
    };
    imagePreview.value = "";
    selectedFile.value = null;
    if (fileInput.value) {
      fileInput.value.value = "";
    }

    await loadBooks();
  } catch (error) {
    console.error("❌ Error adding book:", error);
    alert("Lỗi khi thêm sách: " + error.message);
  } finally {
    addingBook.value = false;
  }
};

const removeBook = async (bookId) => {
  const book = books.value.find((b) => b._id === bookId);
  if (!book) return;

  deletingBookId.value = bookId;
  deletingBookInfo.value = {
    TenSach: book.TenSach,
    MaSach: book.MaSach,
  };
  showDeleteModal.value = true;
};

const confirmDeleteBook = async () => {
  try {
    deletingBook.value = deletingBookId.value;
    console.log("🗑️ Deleting book:", deletingBookId.value);

    await adminService.removeBook(adminStore.token, deletingBookId.value);

    closeDeleteModal();

    showToast("success", "✅ Đã xoá sách thành công!");

    await loadBooks();
  } catch (error) {
    console.error("❌ Error deleting book:", error);
    showToast(
      "error",
      "Lỗi khi xoá sách: " + (error.response?.data?.message || error.message)
    );
  } finally {
    deletingBook.value = "";
  }
};

const closeDeleteModal = () => {
  if (deletingBook.value) return;

  showDeleteModal.value = false;
  deletingBookId.value = "";
  deletingBookInfo.value = null;
};

const showToast = (type, message) => {
  const toast = document.createElement("div");
  toast.className = `toast-notification ${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <i class="fas fa-${
        type === "success" ? "check-circle" : "exclamation-circle"
      } me-2"></i>
      ${message}
    </div>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

onMounted(() => {
  loadBooks();
  loadNXBList();
});
</script>

<style scoped>
.admin-manage-sach {
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

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(44, 62, 80, 0.25);
}

.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-header {
  border-bottom: 1px solid #dee2e6;
}

.btn-group-sm > .btn {
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 9999;
  transform: translateX(120%);
  transition: transform 0.3s ease;
  min-width: 300px;
  max-width: 400px;
}

.toast-notification.show {
  transform: translateX(0);
}

.toast-notification.success {
  background-color: #28a745;
  border-left: 4px solid #1e7e34;
}

.toast-notification.error {
  background-color: #dc3545;
  border-left: 4px solid #c82333;
}

.toast-content {
  display: flex;
  align-items: center;
}
</style>
