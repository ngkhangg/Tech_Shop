<template>
  <div class="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg">
    <h2 class="text-2xl font-semibold text-center text-gray-800 mb-6">
      <i class="fas fa-history text-blue-500"></i> Lịch sử mua hàng
    </h2>

    <div v-if="loading" class="flex justify-center py-6">
      <div class="loader"></div>
    </div>

    <p v-if="error" class="text-red-500 text-center flex items-center justify-center">
      <i class="fas fa-exclamation-triangle mr-2"></i> {{ error }}
    </p>

    <div v-if="orders.length > 0" class="order-container">
      <div v-for="(order, index) in orders" :key="order.id" class="order-card pb-4 mb-4">
        <hr v-if="index !== 0" class="border-t border-gray-300 my-4">

        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold flex items-center">
            <i class="fas fa-file-invoice-dollar text-green-500 mr-2"></i> Đơn hàng #{{ order.order_number }}
          </h3>
          <p class="status-badge flex items-center px-3 py-1 rounded-lg text-sm" :class="getStatusClass(order.status)">
            <i :class="getStatusIcon(order.status)" class="mr-1"></i> {{ getStatusText(order.status) }}
          </p>
        </div>

        <div class="flex justify-between mt-2 text-gray-600">
          <p class="flex items-center">
            <i class="far fa-calendar-alt text-blue-500 mr-2"></i> Ngày đặt: {{ formatDate(order.created_at) }}
          </p>
          <p class="flex items-center">
            <i class="fas fa-coins text-yellow-500 mr-2"></i> Tổng tiền:
            <strong class="text-green-600 ml-1">{{ formatPrice(order.total_price) }}</strong>
          </p>
        </div>

        <div class="mt-4">
          <h4 class="text-md font-semibold flex items-center">
            <i class="fas fa-box-open text-purple-500 mr-2"></i> Sản phẩm:
          </h4>
          <div class="products-container">
            <div v-for="item in order.items" :key="item.product_id" class="product-card">
              <img :src="item.product_image" alt="Ảnh sản phẩm" class="product-image" />
              <div class="product-info">
                <p class="font-medium truncate">{{ item.product_name }}</p>
                <p class="text-sm text-gray-600">SL: {{ item.quantity }}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <p v-else class="text-gray-500 text-center">
      <i class="fas fa-shopping-bag text-gray-400"></i> Bạn chưa có đơn hàng nào!
    </p>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    const orders = ref([]);
    const error = ref(null);
    const loading = ref(false);

    const getOrders = async (userId) => {
      loading.value = true;
      error.value = null;

      try {
        const response = await fetch(`http://localhost:3000/orders?user_id=${userId}`);
        if (!response.ok) throw new Error("Không thể lấy dữ liệu đơn hàng!");

        orders.value = await response.json();
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      const user_id = localStorage.getItem("user_id");
      if (user_id) {
        getOrders(user_id);
      } else {
        error.value = "Không tìm thấy ID người dùng! Vui lòng đăng nhập.";
      }
    });

    const formatDate = (date) => new Date(date).toLocaleDateString("vi-VN");

    const getStatusText = (status) => {
      switch (status) {
        case "pending":
          return "Đang xử lý";
        case "completed":
          return "Đã hoàn thành";
        case "cancelled":
          return "Đã hủy";
        default:
          return "Không xác định";
      }
    };

    const formatPrice = (price) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case "pending":
          return "fas fa-hourglass-half";
        case "completed":
          return "fas fa-check-circle";
        case "cancelled":
          return "fas fa-times-circle";
        default:
          return "fas fa-question-circle";
      }
    };

    const getStatusClass = (status) => {
      return {
        "status-pending": status === "pending",
        "status-completed": status === "completed",
        "status-cancelled": status === "cancelled",
      };
    };

    return { orders, error, loading, formatDate, getStatusText, getStatusIcon, getStatusClass, formatPrice };
  }
};
</script>

<style>
.order-container {
  display: column;
  flex-wrap: nowrap;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.order-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  min-width: 320px;
  flex-shrink: 0;
}


.status-badge {
  text-transform: uppercase;
  font-weight: bold;
}
.products-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.product-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #fff;
  padding: 12px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 150px;
  height: 180px; /* Đảm bảo chiều cao đồng nhất */
}

.product-image {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 6px;
}

.product-info {
  margin-top: 8px;
}

.product-info p {
  font-size: 14px;
  font-weight: 500;
}

hr {
  border: none;
  height: 1px;
  background-color: #d1d5db; /* Màu xám */
  margin: 12px 0;
}

</style>
