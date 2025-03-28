<template>
  <div class="page-container">
    <div class="login-container">
      <h2>Đăng Nhập</h2>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label>Email:</label>
          <input type="email" v-model="email" required />
        </div>
        <div class="input-group">
          <label>Mật khẩu:</label>
          <div class="password-wrapper">
            <input :type="showPassword ? 'text' : 'password'" v-model="password" required />
            <span @click="togglePasswordVisibility" class="toggle-password">
              <font-awesome-icon :icon="showPassword ? 'eye' : 'eye-slash'" />
            </span>
          </div>
        </div>
        <button type="submit">Đăng nhập</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p class="switch-text">
        Chưa có tài khoản? <span @click="goToRegister">Đăng ký ngay</span>
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "@/eventBus";

export default {
  name: "ComLogin",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
      showPassword: false,
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async handleLogin() {
      try {
        const response = await axios.post("http://localhost:3000/auth/login", {
          email: this.email,
          password: this.password,
        });

        if (response.data.token) {
          // Lưu thông tin vào localStorage
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("refreshToken", response.data.refreshToken);

          const user = {
            id: response.data.user?.id || response.data.id,
            name: response.data.user?.name || response.data.name,
            email: response.data.user?.email || response.data.email,
            role: response.data.user?.role || response.data.role,
          };

          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("user_id", user.id); // Lưu user_id riêng biệt

          // Phát sự kiện cập nhật giao diện
          eventBus.emit("user-logged-in", user);

          // Nếu có Vuex, cập nhật user
          if (this.$store) {
            this.$store.commit("setUser", user);
          }

          // Chuyển hướng về trang chủ
          this.$router.push("/");
        } else {
          this.errorMessage = "Thông tin đăng nhập không hợp lệ!";
        }
      } catch (error) {
        this.errorMessage = error.response?.data?.error || "Đăng nhập thất bại!";
      }
    },
    goToRegister() {
      this.$router.push("/register");
    }
  }
};
</script>


<style scoped>
.page-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100vh;
  background: white;
  padding-right: 50px;
  transition: all 0.3s ease-in-out;
}


.login-container {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  transform: translateX(30px);
  opacity: 0;
  animation: fadeInRight 0.6s ease-in-out forwards;
}

.switch-text {
  margin-top: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #444;
}

.switch-text span {
  color: #0056b3;
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  transition: color 0.3s ease-in-out;
}

.switch-text span:hover {
  text-decoration: underline;
  color: #003d80;
}


@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}


h2 {
  font-size: 28px;
  color: #0044cc;
  margin-bottom: 20px;
  font-weight: bold;
}


.input-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.input-group label {
  font-weight: 600;
  font-size: 14px;
  color: #444;
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease-in-out;
}

input:focus {
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.4);
  outline: none;
}

.input-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease-in-out;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease-in-out;
}

button:hover {
  background: linear-gradient(135deg, #0056b3, #004494);
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0, 91, 187, 0.4);
}


.error {
  color: red;
  margin-top: 10px;
  font-size: 14px;
  font-weight: 600;
}

.password-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  border: 2px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.password-wrapper input {
  flex: 1;
  border: none;
  padding: 12px;
  font-size: 16px;
  outline: none;
  box-sizing: border-box;
}

.toggle-password {
  padding: 12px;
  cursor: pointer;
  font-size: 18px;
  color: #007bff;
  background: white;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-password:hover {
  color: #0056b3;
}

button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease-in-out;
  margin-top: 15px; /* Tăng khoảng cách với ô mật khẩu */
}


button:hover {
  background: linear-gradient(135deg, #0056b3, #004494);
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0, 91, 187, 0.4);
}

</style>
