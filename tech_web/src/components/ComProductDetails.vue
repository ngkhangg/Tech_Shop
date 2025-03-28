<template>
    <div class="product-details-container">

        <div v-if="product" class="product-details">
            <img :src="product.image" alt="Ảnh sản phẩm" @error="imageError" />
            <div class="details">
                <h2>{{ product.name }}</h2>
                <p class="price">Giá: {{ formatPrice(product.price) }}</p>
                <p class="stock">Tồn kho: {{ product.stock }}</p>
                <p class="description">{{ product.description }}</p>
                <button v-if="product.stock > 0" @click="addToCart" class="add-to-cart-btn">
                     Thêm vào giỏ
                </button>
                <p v-else class="out-of-stock">Hết hàng</p>
                <button @click="$router.push('/products')" class="back-btn">⬅ Quay lại</button>
            </div>
        </div>
        <p v-else>Không tìm thấy sản phẩm.</p>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            product: null,
            cart: JSON.parse(localStorage.getItem("cart")) || []
        };
    },
    async created() {
        const productId = this.$route.params.id;
        try {
            const response = await axios.get(`http://localhost:3000/products/${productId}`);
            this.product = { ...response.data, originalStock: response.data.stock };
            this.syncCartWithStock();
        } catch (error) {
            console.error("Lỗi khi tải sản phẩm:", error);
            alert("Không thể tải thông tin sản phẩm!");
        }
    },
    methods: {
        formatPrice(price) {
            return new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND"
            }).format(price);
        },
        imageError(event) {
            event.target.src = "https://via.placeholder.com/150";
        },
        addToCart() {
            let cartItem = this.cart.find(item => item.id === this.product.id);
            if (cartItem) {
                if (cartItem.quantity < this.product.originalStock) {
                    cartItem.quantity++;
                } else {
                    alert("Số lượng vượt quá tồn kho!");
                    return;
                }
            } else {
                this.cart.push({ ...this.product, quantity: 1 });
            }
            this.product.stock--;
            this.updateLocalStorage();
            this.$emit("updateStock", { id: this.product.id, stock: this.product.stock });
        },
        syncCartWithStock() {
            let cartItem = this.cart.find(item => item.id === this.product.id);
            if (cartItem) {
                this.product.stock -= cartItem.quantity;
            }
        },
        updateLocalStorage() {
            localStorage.setItem("cart", JSON.stringify(this.cart));
        }
    }
};
</script>

<style scoped>
.product-details-container {
    padding: 40px 20px;
    text-align: center;
    font-family: "Poppins", sans-serif;
    background: #f9f9f9;
    min-height: 100vh;
}

.product-details {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    max-width: 900px;
    margin: auto;
}

.product-details img {
    width: 350px;
    height: auto;
    border-radius: 10px;
    object-fit: cover;
    transition: transform 0.3s ease;
}


.details {
    max-width: 400px;
    text-align: left;
    padding: 20px;
}

.details h2 {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.price {
    font-size: 22px;
    color: #e74c3c;
    font-weight: bold;
    margin-bottom: 10px;
}

.stock {
    font-size: 16px;
    color: #555;
    margin-bottom: 10px;
}

.description {
    margin-top: 10px;
    font-size: 16px;
    line-height: 1.6;
    color: #444;
}

.add-to-cart-btn,
.back-btn {
    display: block;
    width: 100%;
    padding: 12px;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 15px;
}

.add-to-cart-btn {
    background: linear-gradient(90deg, #0066cc, #00bfff);
    color: white;
}

.add-to-cart-btn:hover {
    background: linear-gradient(90deg, #0066cc, #00bfff);
    transform: scale(1.05);
    box-shadow: 0 4px 10px rgba(40, 167, 69, 0.3);
}

.out-of-stock {
    font-size: 16px;
    color: #e74c3c;
    font-weight: bold;
    margin-top: 15px;
}

.back-btn {
    background: #ccc;
    color: #333;
}

.back-btn:hover {
    background: #bbb;
    transform: scale(1.05);
}
</style>