<template>
    <div class="profile-container">
        <h1>Thông tin người dùng</h1>
        <div v-if="user" class="profile-info">
            <p><strong>Họ và tên:</strong> {{ user.name }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Vai trò:</strong> {{ user.role }}</p>

            <!-- Hiển thị nút Dashboard nếu user là admin -->
            <button v-if="user.role === 'admin'" @click="goToDashboard" class="admin-button">
                Quản lý hệ thống
            </button>


            <!-- Nút xem lịch sử mua hàng -->
            <button @click="goToOrderHistory" class="order-history-button">
                Xem lịch sử mua hàng
            </button>
        </div>

        <div v-else>
            <p>Vui lòng đăng nhập để xem thông tin.</p>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
    name: 'ComProfile',
    setup() {
        const user = ref(null);
        const router = useRouter();

        // Hàm lấy thông tin người dùng từ localStorage
        const getUserProfile = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                user.value = JSON.parse(storedUser);
            }
        };

        // Chuyển hướng đến trang Dashboard
        const goToDashboard = () => {
            router.push('/dashboard');
        };
        
        const goToOrderHistory = () => {
            router.push('/order-history');
        };

        onMounted(() => {
            getUserProfile();
        });

        return {
            user,
            goToDashboard,
            goToOrderHistory
        };
    }
};
</script>

<style scoped>

.profile-container {
    width: 100%;
    max-width: 600px;
    margin: 40px auto;
    padding: 30px;
    border-radius: 20px;
    font-family: 'Poppins', sans-serif;
}



h1 {
    text-align: center;
    font-size: 28px;
    font-weight: 700;
    color: #333;
    margin-bottom: 25px;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}


.profile-info {
    background: #ffffff;
    padding: 25px;
    border-radius: 15px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 15px;
    animation: fadeIn 0.5s ease-in-out;
}

.profile-info p {
    font-size: 18px;
    color: #444;
    line-height: 1.6;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
}

.profile-info strong {
    font-weight: 600;
    color: #222;
    margin-right: 8px;
}


button {
    display: inline-block;
    padding: 12px 20px;
    font-size: 16px;
    font-weight: bold;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
}


.admin-button {
    background: linear-gradient(to right, #007bff, #0056b3);
    box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);
}

.admin-button:hover {
    background: linear-gradient(to right, #0056b3, #003f8c);
    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.5);
}


.order-history-button {
    background: linear-gradient(to right, #ff7e5f, #ff3f34);
    box-shadow: 0 4px 10px rgba(255, 99, 71, 0.3);
}

.order-history-button:hover {
    background: linear-gradient(to right, #ff3f34, #c62828);
    box-shadow: 0 4px 15px rgba(255, 99, 71, 0.5);
}


@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}


@media (max-width: 768px) {
    .profile-container {
        padding: 20px;
    }

    h1 {
        font-size: 24px;
    }

    .profile-info {
        padding: 20px;
    }

    .profile-info p {
        font-size: 16px;
    }

    button {
        font-size: 14px;
        padding: 10px 18px;
    }
}
</style>
