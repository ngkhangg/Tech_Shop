<template>
  <div class="contact-container">
    <div class="contact-intro">
      <h1>Liên Hệ Với Chúng Tôi</h1>
      <p>Chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc của bạn. Hãy điền thông tin vào form dưới đây để chúng tôi có thể
        hỗ trợ bạn nhanh chóng.</p>
    </div>

    <div class="contact-form">
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="name"><i class="fas fa-user "></i> Họ và Tên</label>
          <input type="text" id="name" v-model="form.name" required />
        </div>

        <div class="form-group">
          <label for="email"><i class="fas fa-envelope "></i> Email</label>
          <input type="email" id="email" v-model="form.email" required />
        </div>

        <div class="form-group">
          <label for="message"><i class="fas fa-comment-dots "></i> Tin nhắn</label>
          <textarea id="message" v-model="form.message" rows="5" required></textarea>
        </div>

        <button type="submit" class="submit-btn"><i class="fas fa-paper-plane"></i> Gửi</button>
      </form>
    </div>

    <div v-if="submitSuccess" class="submit-success">
      <p><i class="fas fa-check-circle"></i> Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ phản hồi bạn sớm nhất có
        thể!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ComContact",
  data() {
    return {
      form: {
        name: "",
        email: "",
        message: "",
      },
      submitSuccess: false,
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await fetch("http://localhost:3000/contacts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.form),
        });

        const data = await response.json();
        alert(data.message);

        // Kiểm tra nếu gửi thành công thì reset form
        if (response.ok) {
          this.form = {
            name: "",
            email: "",
            message: "",
          };
          this.submitSuccess = true; // Hiển thị thông báo thành công
          setTimeout(() => {
            this.submitSuccess = false; // Ẩn thông báo sau 3s
          }, 3000);
        }
      } catch (error) {
        console.error("Lỗi gửi email:", error);
        alert("Gửi email thất bại!");
      }
    }
  }
};
</script>

<style scoped>
/* CSS cho trang liên hệ */
.contact-container {
  padding: 20px;
  font-family: "Poppins", sans-serif;
  background: #f9f9f9;
  min-height: 100vh;
}

.contact-intro {
  text-align: center;
  margin-bottom: 30px;
}

.contact-intro h1 {
  font-size: 36px;
  margin-bottom: 10px;
}

.contact-intro p {
  font-size: 18px;
  color: #555;
}

.contact-form {
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: flex;
  align-items: center;
  font-size: 16px;
  margin-bottom: 5px;
  color: #333;
}

.form-group label i {
  margin-right: 10px;
  color: #ff5e62;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-group textarea {
  resize: vertical;
}

.submit-btn {
  background: linear-gradient(to right, #ff9966, #ff5e62);
  color: #fff;
  padding: 12px 25px;
  font-size: 18px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.submit-btn i {
  margin-right: 8px;
}

.submit-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 15px rgba(255, 94, 98, 0.4);
}

.submit-success {
  text-align: center;
  background: #eaffea;
  padding: 20px;
  border-radius: 10px;
  color: #4caf50;
  margin-top: 30px;
}

.submit-success i {
  margin-right: 10px;
}
</style>