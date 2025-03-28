<template>
  <div class="page-container">
    <div class="register-container">
      <h2>Đăng Ký</h2>
      <form @submit.prevent="register">
        <div class="input-group">
          <label>Họ và Tên:</label>
          <input v-model="name" type="text" placeholder="Nhập họ và tên" required />
        </div>
        <div class="input-group">
          <label>Email:</label>
          <input v-model="email" type="email" placeholder="Nhập email" required />
        </div>
        <div class="input-group">
          <label>Mật khẩu:</label>
          <div class="password-wrapper">
            <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Nhập mật khẩu" required />
            <span @click="togglePasswordVisibility" class="toggle-password">
              <font-awesome-icon :icon="showPassword ? 'eye' : 'eye-slash'" />
            </span>
          </div>
        </div>

        <div class="input-group">
          <label>Xác nhận mật khẩu:</label>
          <div class="password-wrapper">
            <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword"
              placeholder="Nhập lại mật khẩu" required />
            <span @click="toggleConfirmPasswordVisibility" class="toggle-password">
              <font-awesome-icon :icon="showConfirmPassword ? 'eye' : 'eye-slash'" />
            </span>
          </div>
        </div>
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? "Đang đăng ký..." : "Đăng ký" }}
        </button>

      </form>
      <p v-if="message" class="message">{{ message }}</p>
      <p class="switch-text">
        Đã có tài khoản?
        <span @click="goToLogin">Đăng nhập ngay</span>
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";


export default {
  name: "ComRegister",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      message: "",
      showPassword: false,
      showConfirmPassword: false,
      isLoading: false,
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    async register() {
      this.message = "";

      if (!this.validateEmail(this.email)) {
        this.message = "Email không hợp lệ!";
        return;
      }
      if (this.password.length < 6) {
        this.message = "Mật khẩu phải có ít nhất 6 ký tự!";
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.message = "Mật khẩu nhập lại không khớp!";
        return;
      }

      this.isLoading = true;
      try {
        const response = await axios.post("http://localhost:3000/auth/register", {
          name: this.name,
          email: this.email,
          password: this.password,
        });

        this.message = response.data.message;

        if (response.data.success) {
          // Reset form trước khi chuyển trang
          this.name = "";
          this.email = "";
          this.password = "";
          this.confirmPassword = "";

          console.log("Chuyển hướng sang trang đăng nhập..."); // Debug log
          this.goToLogin(); // Gọi trực tiếp thay vì dùng setTimeout
        }
      } catch (error) {
        this.message = error.response?.data?.error || "Lỗi đăng ký";
      } finally {
        this.isLoading = false;
      }
    },

    validateEmail(email) {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(email);
    },

    goToLogin() {
      console.log("Hàm goToLogin() đã được gọi!"); 
      this.$router.push({ path: "/login" });
    }

  },
};
</script>

<style scoped>
.page-container {
  display: flex;
  align-items: center;
  justify-content: right;
  height: 100vh;
  background: white;
  padding: 20px;
  transition: all 0.3s ease-in-out;
  position: relative;
}

.background-image {
  position: absolute;
  right: 0;
  top: 0;
  width: 50%;
  /* Hình ảnh chiếm nửa màn hình */
  height: 100%;
  background-image: url("@/assets/logo_image.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.register-container {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: fadeIn 0.6s ease-in-out forwards;
}

.switch-text {
  margin-top: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #444;
}

.switch-text span {
  color: #0056b3;
  /* Xanh dương đậm */
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  transition: color 0.3s ease-in-out;
}

.switch-text span:hover {
  text-decoration: underline;
  color: #003d80;
  /* Màu tối hơn khi hover */
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
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 5px;
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
  margin-top: 15px;
}


button:hover {
  background: linear-gradient(135deg, #0056b3, #004494);
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0, 91, 187, 0.4);
}

.message {
  color: red;
  margin-top: 10px;
  font-size: 14px;
  font-weight: 600;
}



.required {
  color: red;
  font-weight: bold;
  margin-left: 5px;
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
</style>
