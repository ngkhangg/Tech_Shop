<template>
  <header class="header">
    <!-- Logo -->
    <div class="logo">
      <router-link to="/">
        <img src="@/assets/Logo_web.png" alt="Logo" />
      </router-link>
    </div>

    <!-- Menu điều hướng -->
    <nav class="nav">
      <ul class="nav-menu">
        <transition-group name="nav-fade" tag="ul" class="nav-menu">
          <li v-for="(item, index) in menuItems" :key="index">
            <router-link :to="item.path">{{ item.label }}</router-link>
          </li>
        </transition-group>
      </ul>
    </nav>

    <!-- Hành động trên Header (Tìm kiếm, Giỏ hàng, Thông tin người dùng) -->
    <div class="header-actions">
      <!-- Thanh tìm kiếm -->
      <form @submit.prevent="searchProducts" class="search-container">
        <input type="text" v-model.trim="searchQuery" placeholder="Tìm kiếm sản phẩm..." class="search-bar" />
        <button type="submit" class="search-button">
          <i class="fas fa-search"></i>
        </button>
      </form>

      <!-- Các biểu tượng trên header (Giỏ hàng, Tài khoản người dùng) -->
      <div class="icons">
        <router-link to="/cart" class="cart-icon" aria-label="Giỏ hàng">
          <i class="fas fa-shopping-cart"></i>
        </router-link>

        <!-- Nếu người dùng đã đăng nhập -->
        <div v-if="user" class="user-info">
          <router-link to="/profile" class="account-icon">
            <i class="fas fa-user"></i>
          </router-link>
          <button @click="logout" class="logout-button">Đăng xuất</button>
        </div>

        <!-- Nếu người dùng chưa đăng nhập -->
        <router-link v-else to="/login" class="account-icon">
          <i class="fas fa-user"></i>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script>
import { eventBus } from "@/eventBus";

export default {
  name: "HeaderComponent",
  data() {
    return {
      menuItems: [
        { label: "Trang chủ", path: "/" },
        { label: "Sản phẩm", path: "/products" },
        { label: "Giới thiệu", path: "/about" },
        { label: "Liên hệ", path: "/contact" },
      ],
      user: null, // Trạng thái đăng nhập của người dùng
      searchQuery: "", // Từ khóa tìm kiếm
    };
  },
  created() {
    this.checkUserLogin();

    // Lắng nghe sự kiện đăng nhập
    eventBus.on("user-logged-in", (userData) => {
      this.user = userData;
    });

    // Lắng nghe sự kiện đăng xuất
    eventBus.on("user-logged-out", () => {
      this.user = null;
    });
  },
  beforeUnmount() {
    // Hủy lắng nghe sự kiện khi component bị hủy
    eventBus.off("user-logged-in");
    eventBus.off("user-logged-out");
  },
  methods: {
    // Kiểm tra trạng thái đăng nhập của người dùng
    checkUserLogin() {
      const userId = localStorage.getItem("user_id");
      this.user = userId ? { id: userId } : null;
    },
    // Đăng xuất
    logout() {
      localStorage.removeItem("user_id");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("cart");
      this.user = null;

      // Phát sự kiện đăng xuất
      eventBus.emit("user-logged-out");

      this.$router.push("/login");
    },
    // Xử lý tìm kiếm sản phẩm
    searchProducts() {
      const query = this.searchQuery.trim();

      if (!query) {
        this.$router.push("/products");
        return;
      }

      // Kiểm tra nếu query là số, giả sử nhập "500000" sẽ tìm theo giá
      if (!isNaN(query)) {
        this.$router.push({ path: "/products", query: { price: query } });
      } else {
        this.$router.push({ path: "/products", query: { q: query } });
      }
    },
  },
};
</script>


<style scoped>
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: linear-gradient(90deg, #0066cc, #00bfff);
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  top: 0;
  z-index: 1000;
  animation: fadeInDown 0.6s ease-in-out both;
  will-change: transform, opacity;
}

.logo img {
  height: 50px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: zoomIn 0.8s ease-in-out both;
  will-change: transform, opacity;
}

.nav-menu {
  list-style: none;
  display: flex;
  gap: 30px;
  margin: 0;
  padding: 0;
}

.nav-menu li {
  font-size: 18px;
  font-weight: 600;
  opacity: 0;
  animation: slideUp 0.5s ease-in-out forwards;
}

.nav-menu li:nth-child(1) {
  animation-delay: 0.2s;
}

.nav-menu li:nth-child(2) {
  animation-delay: 0.4s;
}

.nav-menu li:nth-child(3) {
  animation-delay: 0.6s;
}

.nav-menu li:nth-child(4) {
  animation-delay: 0.8s;
}

.nav-menu li a {
  text-decoration: none;
  color: white;
  position: relative;
  transition: color 0.3s ease-in-out, transform 0.2s ease-in-out;
  will-change: transform, color;
}

.nav-menu li a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -5px;
  width: 0;
  height: 2px;
  background-color: #ff6347;
  transition: width 0.3s ease;
}

.nav-menu li a:hover::after {
  width: 100%;
}

.nav-menu li a:hover {
  transform: scale(1.1);
  color: #ff6347;
}


.search-container {
  display: flex;
  align-items: center;
  position: relative;
  width: 280px;
  max-width: 100%;
  background: #f4f4f4;
  border-radius: 30px;
  padding: 5px 15px;
  transition: box-shadow 0.3s ease-in-out;
}

.search-bar {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 16px;
  outline: none;
  padding: 10px;
  color: #333;
}

.search-bar::placeholder {
  color: #aaa;
}

.search-container:focus-within {
  box-shadow: 0 0 8px rgba(0, 102, 204, 0.5);
}

.search-icon {
  color: #0066cc;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.search-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0066cc;
  font-size: 18px;
}

.search-icon:hover {
  color: #0066cc;
}

.icons {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-grow: 1;
}

.account-icon,
.cart-icon {
  font-size: 24px;
  text-decoration: none;
  color: white;
  transition: transform 0.3s ease, color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.account-icon:hover,
.cart-icon:hover {
  transform: scale(1.1);
  color: #ff6347;
  background: rgba(255, 255, 255, 0.4);
}


.logout-button {
  background: #ff6347;
  border: 2px solid #ff6347;
  color: #ffffff;
  padding: 8px 16px;
  /* Giảm padding để nút nhỏ gọn hơn */
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out, transform 0.2s ease-in-out;
}

.logout-button:hover {
  background-color: #ff3b2f;
  transform: scale(1.05);
}

.logout-button:active {
  transform: scale(0.95);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
  font-size: 16px;
}

.user-info .account-icon {
  display: flex;
  align-items: center;
  font-weight: bold;
}


@media (max-width: 768px) {
  .header {
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
  }

  .nav-menu {
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
  }

  .search-bar {
    width: 100%;
    max-width: 300px;
  }

  .icons {
    gap: 10px;
  }

  .nav-fade-enter-active,
  .nav-fade-leave-active {
    transition: opacity 0.5s, transform 0.5s;
  }

  .nav-fade-enter-from,
  .nav-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }

}
</style>
