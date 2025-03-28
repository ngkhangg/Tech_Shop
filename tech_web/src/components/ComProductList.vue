<template>
  <div class="product-container">
    <h2>Danh sách sản phẩm</h2>
    <div class="sort-container">
      <label for="sort">Sắp xếp:</label>
      <div class="sort-dropdown-wrapper">
        <select v-model="sortOrder" class="sort-dropdown">
          <option value="id">Mặc định</option>
          <option value="name">Tên (A → Z)</option>
          <option value="asc">Giá: Thấp → Cao</option>
          <option value="desc">Giá: Cao → Thấp</option>
        </select>
        <span class="dropdown-icon">▼</span>
      </div>
    </div>


    <div v-if="filteredProducts.length > 0">
      <transition-group name="fade" tag="div" class="product-list">
        <div v-for="product in filteredProducts" :key="product.id" class="product-item">
          <img :src="product.image" alt="Ảnh sản phẩm" @error="imageError" />
          <div class="product-details">
            <p class="product-name">{{ product.name }}</p>
            <p class="product-price">Giá: {{ formatPrice(product.price) }}</p>
            <p class="product-stock">Tồn kho: {{ product.stock || 0 }}</p>
            <button v-if="product.stock > 0" @click="addToCart(product)" class="add-to-cart-btn">
              Thêm vào giỏ
            </button>
            <p v-else class="out-of-stock">Hết hàng</p>
            <button @click="viewProductDetails(product.id)" class="view-details-btn">Xem Chi Tiết</button>
          </div>
        </div>
      </transition-group>
    </div>
    <p v-else>Không tìm thấy sản phẩm phù hợp.</p>



    <!-- Phân trang -->
    <div class="pagination">
      <button @click="setPage(1)" :disabled="currentPage === 1">Đầu</button>
      <button @click="prevPage" :disabled="currentPage === 1">←</button>

      <template v-for="page in visiblePages" :key="page">
        <button v-if="page === '...'" disabled class="dots">...</button>
        <button v-else :class="{ active: currentPage === page }" @click="setPage(page)">
          {{ page }}
        </button>
      </template>

      <button @click="nextPage" :disabled="currentPage === totalPages">→</button>
      <button @click="setPage(totalPages)" :disabled="currentPage === totalPages">Cuối</button>
      <p class="page-info">Trang {{ currentPage }} / {{ totalPages }}</p>
    </div>
  </div>


</template>

<script>
import axios from "axios";


export default {
  data() {
    return {
      products: [],
      cart: [],
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 8,
      sortOrder: "id",
      selectedCategory: "all",
    };
  },
  async created() {
    this.loadCart();
    try {
      const response = await axios.get("http://localhost:3000/products");
      this.products = response.data.map(product => ({
        ...product,
        originalStock: product.stock || 0,
        stock: product.stock || 0
      }));
      this.syncCartWithStock();
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
      alert("Không thể tải danh sách sản phẩm. Vui lòng thử lại!");
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.products.length / this.itemsPerPage);
    },
    filteredProducts() {
      const query = this.$route.query.q ? this.$route.query.q.toLowerCase() : "";
      const price = this.$route.query.price ? parseInt(this.$route.query.price) : null;
      const category = this.selectedCategory;

      return this.products
        .filter(product => {
          const matchesCategory = category === "all" || product.category_id === category;
          const matchesQuery = product.name.toLowerCase().includes(query);
          const matchesPrice = price ? product.price <= price : true;

          return matchesCategory && matchesQuery && matchesPrice;
        })
        .sort((a, b) => {
          if (this.sortOrder === "asc") return a.price - b.price;
          if (this.sortOrder === "desc") return b.price - a.price;
          if (this.sortOrder === "name") return a.name.localeCompare(b.name, "vi");
          return a.id - b.id;
        })
        .slice(
          (this.currentPage - 1) * this.itemsPerPage,
          this.currentPage * this.itemsPerPage
        );
    },
    visiblePages() {
      const pages = [];
      const total = this.totalPages;
      const current = this.currentPage;

      if (total <= 5) {
        for (let i = 1; i <= total; i++) pages.push(i);
      } else {
        if (current > 3) pages.push(1, "...");
        for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
        if (current < total - 2) pages.push("...", total);
      }
      return pages;
    }
  },
  watch: {
    '$route.query.category': {
      immediate: true,
      handler(newCategory) {
        this.selectedCategory = newCategory || "all";
      }
    },
    '$route.query.q': {
      immediate: true,
      handler(newQuery) {
        this.searchQuery = newQuery || "";
        this.currentPage = 1;
      }
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
    },
    filterByCategory(category) {
      this.selectedCategory = category;
    },
    imageError(event) {
      event.target.src = "https://via.placeholder.com/150";
    },
    addToCart(product) {
      let cartItem = this.cart.find(item => item.id === product.id);
      if (cartItem) {
        if (cartItem.quantity < product.originalStock) {
          cartItem.quantity++;
        } else {
          alert("Số lượng vượt quá tồn kho!");
          return;
        }
      } else {
        if (product.stock > 0) {
          this.cart.push({ ...product, quantity: 1 });
        } else {
          alert("Sản phẩm đã hết hàng!");
          return;
        }
      }
      product.stock--;
      this.saveCart();
    },
    viewProductDetails(productId) {
      this.$router.push({ name: "ComProductDetails", params: { id: productId } });
    },
    loadCart() {
      this.cart = JSON.parse(localStorage.getItem("cart")) || [];
    },
    saveCart() {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    syncCartWithStock() {
      this.cart.forEach(cartItem => {
        let productInCatalog = this.products.find(p => p.id === cartItem.id);
        if (productInCatalog) {
          productInCatalog.stock -= cartItem.quantity;
        }
      });
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    setPage(page) {
      this.currentPage = page;
      console.log("Trang hiện tại:", this.currentPage);
    },


  }
};
</script>

<style scoped>
/* Container */
.product-container {
  padding: 20px;
  text-align: center;

  min-height: 100vh;
}

/* Tiêu đề */
h2 {
  font-size: 32px;
  font-weight: bold;
  color: #222;
  margin-bottom: 25px;
  text-transform: uppercase;
}

/* Danh sách sản phẩm */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  justify-content: center;
  padding: 0 10px;
  will-change: opacity, transform;
  animation: fadeIn 0.6s ease-out forwards;
}

.product-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  display: block;
}


/* Sản phẩm */
.product-item {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  overflow: hidden;
}

/* Hover sản phẩm */
.product-item:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

/* Hình ảnh sản phẩm */
@keyframes fadeInImage {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }

  60% {
    opacity: 0.6;
    transform: scale(1.02);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.product-item img {
  max-width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 15px;
  will-change: opacity, transform;
  animation: fadeInImage 0.6s ease-out forwards;
}

/* Thông tin sản phẩm */
.product-details {
  padding: 10px;
}

.product-name {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.product-price {
  font-size: 18px;
  color: #e74c3c;
  font-weight: bold;
}

.product-stock {
  font-size: 16px;
  color: #666;
  margin-bottom: 15px;
}

/* Nút thêm vào giỏ và xem chi tiết */
.add-to-cart-btn,
.view-details-btn {
  display: block;
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  margin-top: 12px;
  position: relative;
  overflow: hidden;
}

/* Hiệu ứng hover */
.add-to-cart-btn {
  background: linear-gradient(90deg, #0066cc, #00bfff);
  color: white;
}

.view-details-btn {
  background: #3498db;
  color: white;
}

.add-to-cart-btn:hover,
.view-details-btn:hover {
  transform: scale(1.05);
  filter: brightness(1.15);
}

/* Hiệu ứng ripple khi nhấn nút */
.add-to-cart-btn::after,
.view-details-btn::after {
  content: "";
  position: absolute;
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: scale(0);
  transition: transform 0.4s ease-out;
  opacity: 0.6;
  top: 50%;
  left: 50%;
  pointer-events: none;
}

.add-to-cart-btn:active::after,
.view-details-btn:active::after {
  transform: scale(4);
  opacity: 0;
}

/* Hiển thị sản phẩm hết hàng */
.out-of-stock {
  font-size: 14px;
  color: red;
  font-weight: bold;
}

/* Phân trang */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.page-info {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  margin-top: 15px;
  color: #333;

}

.pagination button {
  background: white;
  color: #333;
  border: none;
  padding: 10px 15px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s, transform 0.2s;
}

/* Hover nút phân trang */
.pagination button:hover {
  background: #337ab7;
  transform: scale(1.1);
}

/* Nút bị vô hiệu hóa */
.pagination button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Nút trang hiện tại */
.pagination .active {
  color: white;
  background: #337ab7;
}


.sort-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  justify-content: flex-start;
  padding: 10px;

  border-radius: 10px;

  width: fit-content;
}

/* Nhãn (label) */
.sort-container label {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

/* Bọc dropdown */
.sort-dropdown-wrapper {
  position: relative;
  display: inline-block;
}

/* Dropdown */
.sort-dropdown {
  padding: 10px 14px;
  font-size: 16px;
  font-weight: bold;
  border: 2px solid #333;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  appearance: none;
  width: 180px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  outline: none;
}

/* Khi di chuột vào dropdown */
.sort-dropdown:hover {
  border-color: #2980b9;
  background: #f1f1f1;
}

/* Khi chọn dropdown */
.sort-dropdown:focus {
  border-color: #333;
  box-shadow: #333;
}

/* Biểu tượng dropdown (mũi tên) */
.dropdown-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 14px;
  color: #555;
  transition: color 0.3s;
}

/* Khi hover vào dropdown, đổi màu icon */
.sort-dropdown-wrapper:hover .dropdown-icon {
  color: #2980b9;
}

/* Animation dropdown */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.sort-dropdown {
  animation: fadeIn 0.4s ease-out;
}
</style>
