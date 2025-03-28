<template>
  <div class="home-container">
    <!-- Phần giới thiệu sản phẩm nổi bật -->
    <div class="intro-section">
      <h1>Khám phá những sản phẩm tuyệt vời tại TechShop!</h1>
      <p>Chúng tôi cung cấp các sản phẩm công nghệ tiên tiến và chất lượng nhất cho bạn.</p>
      <router-link to="/products">
        <button class="explore-btn">Khám phá ngay</button>
      </router-link>
    </div>

    <!-- Phần tính năng nổi bật -->
    <div class="features">
      <div class="feature-item">
        <h3>Sản phẩm chất lượng</h3>
        <p>TechShop cung cấp những sản phẩm tốt nhất từ các thương hiệu hàng đầu.</p>
      </div>
      <div class="feature-item">
        <h3>Giao hàng nhanh chóng</h3>
        <p>Giao hàng nhanh trên toàn quốc chỉ trong 24 giờ.</p>
      </div>
      <div class="feature-item">
        <h3>Hỗ trợ khách hàng</h3>
        <p>Đội ngũ hỗ trợ tận tình, sẵn sàng giải đáp mọi thắc mắc.</p>
      </div>
    </div>

    <!-- Phần sản phẩm nổi bật -->
    <div class="featured-products">
      <p>Các sản phẩm nổi bật</p>
      <div v-if="products.length > 0" class="products-list">
        <div v-for="(product) in limitedProducts" :key="product.id" class="product-item">
          <img :src="product.image" alt="Ảnh sản phẩm" @error="imageError">
          <h3>{{ product.name }}</h3>
          <p><strong>Giá: </strong>{{ formatPrice(product.price) }}</p>
        </div>
      </div>
      <p v-else>Không có sản phẩm nào để hiển thị.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ComHome",
  data() {
    return {
      products: [],
    };
  },
  mounted() {
    this.fetchFeaturedProducts();
  },
  computed: {
    limitedProducts() {
      return this.products.slice(0, 5); // Giới hạn hiển thị 5 sản phẩm
    },
  },
  methods: {
    async fetchFeaturedProducts() {
      try {
        const response = await axios.get('http://localhost:3000/products');
        this.products = response.data;
        localStorage.setItem("products", JSON.stringify(this.products)); // Lưu sản phẩm vào localStorage
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        alert('Có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại!');
      }
    },
    formatPrice(price) {
      const numericPrice = Number(price);
      if (!isNaN(numericPrice)) {
        return numericPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
      }
      return "0 VND";
    },
  },
};
</script>

<style scoped>
/* Thiết lập chung */
.home-container {
  padding: 20px;
  text-align: center;
  font-family: "Poppins", sans-serif;
  background: #f9f9f9;
  min-height: 100vh;
}

/* Phần giới thiệu */
.intro-section {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: #fff;
  padding: 50px 20px;
  border-radius: 15px;
  margin-bottom: 40px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
}

.intro-section h1 {
  font-size: 36px;
  margin-bottom: 15px;
  color: white;
}

.intro-section p {
  font-size: 18px;
  margin-bottom: 25px;
}

.explore-btn {
  background: linear-gradient(to right, #ff7e5f, #ff5e62);
  color: white;
  padding: 12px 30px;
  font-size: 18px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: 0.3s;
}

.explore-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 15px rgba(255, 94, 98, 0.5);
}

/* Phần tính năng */
.features {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 30px;
}

.feature-item {
  flex: 1;
  min-width: 250px;
  max-width: 300px;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
  text-align: center;
  transition: 0.3s;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.feature-item h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #333;
}

.feature-item p {
  font-size: 16px;
  color: #666;
}

/* Phần sản phẩm nổi bật */
.featured-products {
  margin-top: 40px;
  padding: 30px;

}

.featured-products p {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

/* Danh sách sản phẩm */
.products-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  justify-content: center;
}

.product-item {
  padding: 15px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
  text-align: center;
  transition: 0.3s;
}

.product-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.product-item h3 {
  font-size: 18px;
  margin-top: 10px;
  color: #333;
}

.product-item p {
  font-size: 14px;
  color: #ff0000;
}

/* Ảnh sản phẩm */
.product-item img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 10px;
}

/* Responsive */
@media (max-width: 768px) {
  .features {
    flex-direction: column;
    align-items: center;
  }
  
  .products-list {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}

</style>
