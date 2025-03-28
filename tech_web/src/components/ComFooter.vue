<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-info">
        <p class="footer-brand">TechShop</p>
        <p>&copy; 2025 All Rights Reserved.</p>
        <p>Địa chỉ: 123 Đường ABC, Thành phố XYZ</p>
        <p>Điện thoại: (+84) 123 456 789</p>
        <p>Email: contact@techshop.com</p>
      </div>

      <div class="footer-social">
        <a href="https://www.facebook.com" target="_blank" aria-label="Facebook" class="footer-icon">
          <i class="fab fa-facebook-f"></i>
        </a>
        <a href="https://www.instagram.com" target="_blank" aria-label="Instagram" class="footer-icon">
          <i class="fab fa-instagram"></i>
        </a>
        <a href="https://x.com/" target="_blank" aria-label="X" class="footer-icon">
          <i class="fab fa-x-twitter"></i>
        </a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'ComFooter',
};
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.footer {
  background: linear-gradient(90deg, #0066cc, #00bfff);
  color: white;
  padding: 30px 20px;
  text-align: center;
  font-family: 'Arial', sans-serif;
  box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.6s ease-in-out both;
}

.footer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-info {
  font-size: 16px;
  margin-bottom: 20px;
  text-align: center;
}

.footer-brand {
  font-size: 26px;
  font-weight: bold;
  letter-spacing: 2px;
  margin-bottom: 10px;
  color: #ffffff;
  text-transform: uppercase;
}

.footer-info p {
  color: #f1f1f1;
  margin: 5px 0;
  transition: color 0.3s ease-in-out;
}


.footer-social {
  margin-top: 20px;
  display: flex;
  gap: 15px;
  justify-content: center;
}

.footer-icon {
  color: white;
  font-size: 22px;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, background 0.3s ease;
}

.footer-icon:hover {
  background: #ff3b3b;
  transform: scale(1.2);
  color: #333;
}

.footer-icon:focus {
  outline: none;
}

.footer-icon i {
  transition: transform 0.3s ease;
}

.footer-icon:hover i {
  transform: rotate(360deg);
}

@media (max-width: 768px) {
  .footer-container {
    text-align: center;
  }

  .footer-info {
    margin-bottom: 20px;
  }

  .footer-social {
    margin-top: 15px;
  }
}

</style>
