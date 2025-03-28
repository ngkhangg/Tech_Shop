<template>
    <div class="product-management">
        <h2>Quản lý sản phẩm</h2>

        <button class="btn add" @click="openProductModal(null)">
            <i class="fas fa-plus"></i> Thêm sản phẩm
        </button>

        <p v-if="isLoading">Đang tải dữ liệu...</p>

        <table v-else>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Hình ảnh</th>
                    <th>Tên</th>
                    <th>Mô tả</th>
                    <th>Giá</th>
                    <th>Tồn kho</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in paginatedProducts" :key="product.id">
                    <td>{{ product.id }}</td>
                    <td><img :src="product.image || ''" alt="Hình ảnh" class="product-image" /></td>
                    <td>{{ product.name }}</td>
                    <td>{{ product.description }}</td>
                    <td>{{ formatPrice(product.price) }}</td>
                    <td>{{ product.stock }}</td>
                    <td>
                        <button class="btn edit" @click="openProductModal(product)">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn delete" @click="deleteProduct(product.id)">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Phân trang -->
        <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">«</button>
            <span>Trang {{ currentPage }} / {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">»</button>
        </div>

        <!-- Modal thêm/sửa sản phẩm -->
        <div v-if="isModalOpen" class="modal">
            <div class="modal-content">
                <h3>{{ editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm" }}</h3>

                <label>Tên sản phẩm</label>
                <input v-model="productForm.name" type="text" />

                <label>Mô tả</label>
                <textarea v-model="productForm.description"></textarea>

                <label>Giá</label>
                <input type="text" :value="formatPrice(productForm.price)"
                    @input="productForm.price = Number($event.target.value.replace(/\D/g, ''))" />

                <label>Tồn kho</label>
                <input v-model.number="productForm.stock" type="number" />

                <label>Danh mục</label>
                <select v-model="productForm.category_id">
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                    </option>
                </select>

                <label>Hình ảnh (URL)</label>
                <input v-model="productForm.image" type="text" />

                <div class="modal-footer">
                    <button class="btn save" @click="saveProduct">Lưu</button>
                    <button class="btn close" @click="isModalOpen = false">Đóng</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";

export default {
    name: "ComProductManagement",
    setup() {
        const API_BASE_URL = "http://localhost:3000";

        const products = ref([]);
        const categories = ref([]);
        const isLoading = ref(false);
        const isModalOpen = ref(false);
        const editingProduct = ref(null);
        const productForm = ref({ name: "", description: "", price: 0, stock: 0, category_id: null, image: "" });

        // Phân trang
        const itemsPerPage = 10;
        const currentPage = ref(1);

        const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage));
        const paginatedProducts = computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage;
            return products.value.slice(start, start + itemsPerPage);
        });

        const nextPage = () => {
            if (currentPage.value < totalPages.value) currentPage.value++;
        };
        const prevPage = () => {
            if (currentPage.value > 1) currentPage.value--;
        };

        const openProductModal = (product) => {
            if (product) {
                editingProduct.value = product;
                productForm.value = { ...product };
            } else {
                editingProduct.value = null;
                productForm.value = { name: "", description: "", price: 0, stock: 0, category_id: null, image: "" };
            }
            isModalOpen.value = true;
        };

        const saveProduct = async () => {
            try {
                const method = editingProduct.value ? "PUT" : "POST";
                const url = editingProduct.value
                    ? `${API_BASE_URL}/products/${editingProduct.value.id}`
                    : `${API_BASE_URL}/products`;

                console.log("Gửi request:", method, url);
                console.log("Dữ liệu gửi đi:", JSON.stringify(productForm.value));

                const response = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(productForm.value),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Lỗi khi lưu sản phẩm");
                }

                await fetchProducts();
                isModalOpen.value = false;
            } catch (error) {
                console.error("🚨 Lỗi khi lưu sản phẩm:", error);
            }
        };


        const formatPrice = (price) => {
            return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
        };

        const fetchProducts = async () => {
            isLoading.value = true;
            try {
                const res = await fetch(`${API_BASE_URL}/products`);
                products.value = await res.json();
            } catch (error) {
                console.error("Lỗi lấy sản phẩm:", error);
            } finally {
                isLoading.value = false;
            }
        };

        const deleteProduct = async (productId) => {
            if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
            try {
                const response = await fetch(`${API_BASE_URL}/products/${productId}`, { method: "DELETE" });
                if (!response.ok) throw new Error("Lỗi khi xóa sản phẩm");
                await fetchProducts();
            } catch (error) {
                console.error("Lỗi khi xóa sản phẩm:", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/categories`);
                categories.value = await res.json();
            } catch (error) {
                console.error("Lỗi lấy danh mục:", error);
            }
        };

        onMounted(() => {
            fetchProducts();
            fetchCategories();
        });

        return {
            products, categories, isLoading, isModalOpen, productForm, editingProduct,
            openProductModal, saveProduct, formatPrice, deleteProduct,

            // Phân trang
            paginatedProducts, currentPage, totalPages, nextPage, prevPage,
        };
    },
};
</script>

<style scoped>
.product-management {
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
    border-radius: 10px;
}

h2 {
    text-align: center;
    font-size: 26px;
    color: #333;
    font-weight: bold;
    margin-bottom: 20px;
}

.btn {
    padding: 10px 15px;
    margin: 5px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn i {
    font-size: 16px;
}

.btn.add {
    background: linear-gradient(to right, #71b8ff, #00bfff);
    color: white;
}

.btn.edit {
    background: linear-gradient(to right, #ffff04, #ffe627);
    color: black;
}

.btn.delete {
    background: linear-gradient(to right, #ff4d4d, #ff6666);
    color: white;
}

.btn:hover {
    transform: scale(1.05);
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.15);
}


table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background: #f5f5f5;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}


th,
td {
    border: 1px solid #ddd;
    text-align: center;
    vertical-align: middle;
    padding: 12px;
}

th {
    background: linear-gradient(to right, #71b8ff, #00bfff);
    color: white;
    font-weight: bold;
    padding: 12px;
}

td {
    background: #fff;
    transition: background 0.3s ease;
    border-bottom: 1px solid #ddd;
}


.product-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid #ddd;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-in-out;
}

.modal-content {
    background: linear-gradient(to bottom, #f0f8ff, #cce7ff);
    padding: 25px;
    border-radius: 10px;
    width: 420px;
    text-align: center;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    transform: scale(0.95);
    animation: popUp 0.3s ease-in-out forwards;
}

.modal-content h3 {
    margin-bottom: 15px;
    font-size: 22px;
    color: #333;
    font-weight: bold;
}

.modal-content label {
    display: block;
    text-align: left;
    font-weight: 600;
    color: #444;
    margin: 10px 0 5px;
}

.modal-content input,
.modal-content textarea,
.modal-content select {
    width: 100%;
    padding: 10px;
    border: 2px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

.modal-content input:focus,
.modal-content select:focus,
.modal-content textarea:focus {
    border-color: #007bff;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.4);
    outline: none;
}

.modal-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
}

.modal-footer .btn {
    flex: 1;
    margin: 0 5px;
}

.btn.save {
    background: linear-gradient(to right, #71b8ff, #00bfff);
    color: white;
}

.btn.close {
    background: linear-gradient(to right, #849baa, #cdcecf);
    color: white;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    gap: 8px;
}

.pagination button {
    padding: 8px 15px;
    border: none;
    border-radius: 6px;
    background: linear-gradient(to right, #71b8ff, #00bfff);
    color: white;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.15);
}

.pagination button:hover {
    background: linear-gradient(to right, #71b8ff, #00bfff);
    transform: scale(1.05);
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
}

.pagination button:disabled {
    background: #ccc;
    color: #666;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
}

.pagination span {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin: 0 10px;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes popUp {
    from {
        transform: scale(0.9);
    }

    to {
        transform: scale(1);
    }
}
</style>
