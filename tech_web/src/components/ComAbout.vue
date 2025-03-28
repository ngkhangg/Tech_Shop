<template>
    <div class="com-about">
      <header>
        <h1>Về Chúng Tôi</h1>
        <p>Chúng tôi là một công ty chuyên cung cấp các sản phẩm công nghệ hiện đại với chất lượng tuyệt vời và giá cả hợp lý.</p>
      </header>
  
      <section class="mission">
        <h2>Sứ Mệnh</h2>
        <p>Chúng tôi cam kết mang lại những sản phẩm và dịch vụ tốt nhất cho khách hàng, đáp ứng mọi nhu cầu công nghệ trong cuộc sống hiện đại.</p>
      </section>
  
      <section class="vision">
        <h2>Tầm Nhìn</h2>
        <p>Trở thành trang web trong ngành công nghệ, luôn cập nhật các xu hướng mới nhất và mang lại giá trị lớn cho khách hàng.</p>
      </section>
  
      <section class="contact">
        <h2>Liên Hệ</h2>
        <p>Email: contact@techshop.com</p>
        <p>Điện thoại: (123) 456-7890</p>
      </section>
  
      <!-- Thêm phần Nhóm 8 -->
      <section class="team">
        <h2>Nhóm 8</h2>
        <div class="team-info">
          <p>Thành viên: Trương Võ Nguyên Khang - MSSV: 22150231</p>
          <p>Thành viên: Huỳnh Trung Cảnh - MSSV: 22150244</p>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ComAbout'
  }
  </script>
  
  <style scoped>
  /* Tổng thể trang */
  .com-about {
    padding: 40px;
    background-color: #f4f4f9;
    font-family: 'Arial', sans-serif;
    color: #333;
    line-height: 1.6;
  }
  
  /* Tiêu đề và phần giới thiệu */
  header {
    text-align: center;
    background-color: #4facfe;
    color: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  header h1 {
    font-size: 2.5em;
    margin-bottom: 10px;
    color: white;
  }
  
  header p {
    font-size: 1.2em;
  }
  
  /* Phần chung cho tất cả các section */
  section {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    margin-top: 30px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  /* Tiêu đề các phần */
  section h2 {
    font-size: 2em;
    color: #007BFF;
    margin-bottom: 10px;
    border-bottom: 2px solid #007BFF;
    padding-bottom: 10px;
  }
  
  /* Nội dung các phần */
  section p {
    font-size: 1.1em;
    color: #555;
    margin-top: 15px;
  }
  
  /* Phần Nhóm 8 */
  .team {
    background-color: #ffffff;
  }
  
  .team h2 {
    color: #007BFF;
  }
  
  .team-info p {
    display: block; /* Đảm bảo các phần tử p hiển thị theo chiều dọc */
    font-size: 1.2em;
    color: #333;
    margin-top: 10px;
  }
  
  /* Hiệu ứng hover cho các phần */
  section:hover {
    transform: translateY(-5px);
    transition: transform 0.3s ease;
  }
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    .com-about {
      padding: 20px;
    }
  
    header h1 {
      font-size: 2em;
    }
  
    section h2 {
      font-size: 1.5em;
    }
  
    section p {
      font-size: 1em;
    }
  }
  </style>
  