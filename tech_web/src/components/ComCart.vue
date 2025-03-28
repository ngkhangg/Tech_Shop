<template>
  <div class="cart-container">
    <h2><i class="fas fa-shopping-cart"></i> Giỏ hàng của bạn</h2>

    <p v-if="cart.length === 0" class="empty-cart">
      <i class="fas fa-box-open"></i> Giỏ hàng của bạn đang trống.
    </p>

    <table v-else>
      <thead>
        <tr>
          <th>Hình ảnh</th>
          <th>Sản phẩm</th>
          <th>Giá</th>
          <th>Số lượng</th>
          <th>Thành tiền</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in cart" :key="item.id">
          <td><img :src="item.image" :alt="item.name" class="product-image" /></td>
          <td>{{ item.name }}</td>
          <td>{{ formatPrice(item.price) }}</td>
          <td>
            <button class="quantity-btn" @click="decreaseQuantity(index)"><i class="fas fa-minus"></i></button>
            <span class="quantity">{{ item.quantity }}</span>
            <button class="quantity-btn" @click="increaseQuantity(index)"><i class="fas fa-plus"></i></button>
          </td>
          <td>{{ formatPrice(item.price * item.quantity) }}</td>
          <td>
            <button class="remove-btn" @click="removeFromCart(index)"><i class="fas fa-trash"></i> Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="total-price" v-if="cart.length > 0">
      <strong>Tổng cộng: {{ formatPrice(totalPrice) }}</strong>
    </div>

    <div class="cart-actions">
      <button class="explore-btn" @click="goToProducts"><i class="fas fa-store"></i> Khám phá thêm</button>
      <button class="clear-btn" v-if="cart.length > 0" @click="clearCart"><i class="fas fa-trash-alt"></i> Xóa
        hết</button>
      <button class="checkout-btn" v-if="cart.length > 0" @click="showCheckoutModal = true">
        <i class="fas fa-credit-card"></i> Thanh toán
      </button>
    </div>

    <!-- Modal Thanh Toán -->
    <div v-if="showCheckoutModal" class="modal-overlay">
      <div class="modal">
        <button class="close-modal" @click="showCheckoutModal = false">&times;</button>
        <h2>Thông tin thanh toán</h2>

        <input v-model="form.name" type="text" placeholder="Họ và Tên" class="input-field" />
        <input v-model="form.phone" type="text" placeholder="Số điện thoại" class="input-field" />
        <input v-model="form.address" type="text" placeholder="Địa chỉ" class="input-field" />

        <p class="total-text">Tổng tiền: {{ formatPrice(totalPrice) }}</p>

        <select v-model="form.paymentMethod" class="input-field">
          <option value="cash">Tiền mặt</option>
          <option value="bank">Chuyển khoản</option>
        </select>

        <div class="modal-actions">
          <button class="cancel-btn" @click="showCheckoutModal = false">Hủy</button>
          <button class="confirm-btn" @click="submitOrder">Xác nhận</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Swal from "sweetalert2";

export default {
  name: "ComCart",
  data() {
    return {
      cart: JSON.parse(localStorage.getItem("cart")) || [],
      showCheckoutModal: false,
      form: {
        name: "",
        phone: "",
        address: "",
        paymentMethod: "cash",
      },
    };
  },
  computed: {
    totalPrice() {
      return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
    },
    async submitOrder() {
      if (!this.form.name || !this.form.phone || !this.form.address) {
        Swal.fire("Lỗi", "Vui lòng nhập đầy đủ thông tin!", "error");
        return;
      }
      const user = JSON.parse(localStorage.getItem("user")); // user = { id: 1, name: "Nguyễn Văn A", email: "a@gmail.com" }
      if (!user || !user.id) {
        Swal.fire("Lỗi", "Không tìm thấy tài khoản. Vui lòng đăng nhập!", "error");
        return;
      }


      const orderData = {
        user_id: user.id, 
        recipient_name: this.form.name,
        phone: this.form.phone,
        address: this.form.address,
        items: this.cart,
        total_price: this.totalPrice,
        paymentMethod: this.form.paymentMethod,
      };

      console.log("Dữ liệu gửi đi:", JSON.stringify(orderData, null, 2)); // 🛠 Debug request

      try {
        const response = await fetch("http://localhost:3000/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        const result = await response.json();
        console.log("Kết quả từ server:", result); // 🛠 Debug response

        if (response.ok) {
          Swal.fire("Thành công", "Đơn hàng đã được đặt!", "success");
          localStorage.removeItem("cart");
          this.cart = [];
          this.showCheckoutModal = false;
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        Swal.fire("Lỗi", error.message, "error");
      }
    },
    increaseQuantity(index) {
      if (this.cart[index].quantity < this.cart[index].stock) {
        this.cart[index].quantity++;
        this.saveCart();
      } else {
        Swal.fire("Thông báo", "Số lượng sản phẩm trong kho không đủ!", "warning");
      }
    },
    decreaseQuantity(index) {
      if (this.cart[index].quantity > 1) {
        this.cart[index].quantity--;
        this.saveCart();
      }
    },
    removeFromCart(index) {
      this.cart.splice(index, 1);
      this.saveCart();
    },
    clearCart() {
      Swal.fire({
        title: "Xóa hết sản phẩm?",
        text: "Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng không?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy"
      }).then((result) => {
        if (result.isConfirmed) {
          this.cart = [];
          localStorage.removeItem("cart");
          Swal.fire("Đã xóa!", "Tất cả sản phẩm đã bị xóa khỏi giỏ hàng.", "success");
        }
      });
    },
    saveCart() {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    goToProducts() {
      this.$router.push("/products");
    }
  }
};
</script>

<style scoped>
.cart-container {
  max-width: 1000px;
  margin: 40px auto;
  padding: 30px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  color: #333;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.empty-cart {
  font-size: 18px;
  color: #777;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

th,
td {
  padding: 14px;
  border-bottom: 1px solid #ddd;
}

th {
  background: #007bff;
  color: white;
  text-align: left;
}

td {
  vertical-align: middle;
}

.product-image {
  width: 75px;
  height: 75px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.product-image:hover {
  transform: scale(1.1);
}

.quantity-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quantity-btn:hover {
  background: #007bff;
}

.quantity {
  font-size: 18px;
  font-weight: bold;
  padding: 0 10px;
  display: inline-block;
  min-width: 35px;
  text-align: center;
}

.remove-btn {
  background: #ff4d4d;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: #b52b3a;
}

.cart-actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.cart-actions button {
  padding: 12px 18px;
  font-size: 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.explore-btn {
  background: #007bff;
  color: white;
}

.explore-btn:hover {
  background: #0056b3;
}

.clear-btn {
  background: #ff4d4d;
  color: white;
}

.clear-btn:hover {
  background: #cc0000;
}

.checkout-btn {
  background: #28a745;
  color: white;
}

.checkout-btn:hover {
  background: #1e7e34;
}

.total-price {
  margin-top: 20px;
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  padding: 18px;
  border-radius: 8px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-in-out;
  z-index: 1000;
}

.modal {
  background: #ffffff;
  padding: 25px;
  border-radius: 12px;
  width: 420px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  animation: slideUp 0.4s ease-in-out;
}


.input-field {
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s, box-shadow 0.3s;
  box-sizing: border-box;
}

.input-field:focus {
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
  outline: none;
}


.total-text {
  font-size: 22px;
  font-weight: bold;
  color: #007bff;
  margin: 15px 0;
  padding: 10px;
  background: rgba(0, 123, 255, 0.1);
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
}


.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 15px;
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease-in-out;
}

.cancel-btn {
  background: #ff4d4d;
  color: white;
  border: none;
}

.cancel-btn:hover {
  background: #cc0000;
}

.confirm-btn {
  background: #28a745;
  color: white;
  border: none;
}

.confirm-btn:hover {
  background: #218838;
}


.close-modal {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  color: #777;
  cursor: pointer;
  transition: color 0.3s;
}

.close-modal:hover {
  color: #333;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
