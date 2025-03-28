<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg w-96">
            <h2 class="text-lg font-semibold mb-4">Thông tin thanh toán</h2>

            <!-- Họ và tên -->
            <input v-model="form.name" type="text" placeholder="Họ và Tên" class="w-full p-2 mb-2 border rounded" />

            <!-- Số điện thoại -->
            <input v-model="form.phone" type="text" placeholder="Số điện thoại"
                class="w-full p-2 mb-2 border rounded" />

            <!-- Địa chỉ -->
            <input v-model="form.address" type="text" placeholder="Địa chỉ" class="w-full p-2 mb-2 border rounded" />
            <p class="text-lg font-bold">Tổng tiền: {{ formatPrice(totalPrice) }}</p>

            <!-- Hình thức thanh toán -->
            <select v-model="form.paymentMethod" class="w-full p-2 mb-4 border rounded">
                <option value="cash">Tiền mặt</option>
                <option value="bank">Chuyển khoản</option>
            </select>

            <div class="flex justify-between">
                <button @click="$emit('close')" class="bg-gray-400 text-white px-4 py-2 rounded">Hủy</button>
                <button @click="submitOrder" class="bg-green-500 text-white px-4 py-2 rounded">Xác nhận</button>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
    name: "ComCheckout",
    props: ["cart"],
    data() {
        return {
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
            return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        }
    },
    methods: {
        async submitOrder() {
            if (!this.form.name || !this.form.phone || !this.form.address) {
                Swal.fire("Lỗi", "Vui lòng nhập đầy đủ thông tin!", "error");
                return;
            }

            const orderData = {
                user_id: 1, // Có thể lấy từ hệ thống đăng nhập
                items: this.cart,
                total_price: this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
                paymentMethod: this.form.paymentMethod,
            };

            try {
                const response = await fetch("http://localhost:3000/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(orderData),
                });

                const result = await response.json();
                if (response.ok) {
                    Swal.fire("Thành công", "Đơn hàng đã được đặt!", "success");
                    localStorage.removeItem("cart"); // Xóa giỏ hàng sau khi đặt hàng
                    this.$emit("close"); // Đóng modal
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                Swal.fire("Lỗi", error.message, "error");
            }
        },
        formatPrice(price) {
            return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
        },
    },
};
</script>

<style scoped>
/* Hiệu ứng mờ nền */
.fixed {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
}

/* Hộp modal */
.bg-white {
    width: 400px;
    max-width: 90%;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
}

/* Input và select */
input,
select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
}

/* Nút bấm */
button {
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s ease-in-out;
}

/* Nút Hủy */
.bg-gray-400 {
    background: #ccc;
}

.bg-gray-400:hover {
    background: #b3b3b3;
}

/* Nút Xác nhận */
.bg-green-500 {
    background: #28a745;
    color: white;
}

.bg-green-500:hover {
    background: #218838;
}

/* Tổng tiền */
.text-lg {
    font-size: 18px;
    margin-bottom: 10px;
    color: #333;
    font-weight: bold;
}
</style>
