<template>
  <div class="dashboard-container">
    <h1 class="fade-in">Quản lý hệ thống</h1>

    <div class="option-select fade-in">
      <label>Chọn chức năng:</label>
      <select v-model="selectedOption" class="select-box">
        <option value="products">Quản lý sản phẩm</option>
        <option value="users">Quản lý tài khoản</option>
      </select>
    </div>

    <transition name="fade-slide">
      <ProductManagement v-if="selectedOption === 'products'" />
    </transition>

    <transition name="fade-slide">
      <UserManagement v-if="selectedOption === 'users'" />
    </transition>
  </div>
</template>

<script>
import { ref } from "vue";
import ProductManagement from "@/components/ProductManagement.vue";
import UserManagement from "@/components/UserManagement.vue";

export default {
  name: "ComDashboard",
  components: {
    ProductManagement,
    UserManagement,
  },
  setup() {
    const selectedOption = ref("products");
    return {
      selectedOption,
    };
  },
};
</script>

<style>
.dashboard-container {
  margin: 20px auto;
  padding: 20px;
  text-align: center;
  animation: fadeIn 0.6s ease-in-out;
}

h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.option-select {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.option-select label {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #555;
}

.select-box {
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 6px;
  transition: all 0.3s ease-in-out;
}

.select-box:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.select-box:hover {
  transform: scale(1.05);
  transition: 0.3s;
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.6s ease-in-out;
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Responsive */
@media (max-width: 600px) {
  .dashboard-container {
    padding: 15px;
  }

  h1 {
    font-size: 20px;
  }

  .select-box {
    font-size: 14px;
    padding: 8px;
  }
}
</style>
