<template>
  <div id="app">
    <ComHeader />
    <div class="view-container">
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <ComFooter />
  </div>
</template>

<script>
import ComHeader from './components/ComHeader.vue';
import ComFooter from './components/ComFooter.vue';

export default {
  components: {
    ComHeader,
    ComFooter,
  },
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Hiệu ứng fade + slide khi chuyển trang */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-slide-enter {
  opacity: 0;
  transform: translateY(15px);
  /* Trượt nhẹ xuống */
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px);
  /* Trượt nhẹ lên */
}

/* Định dạng vùng chứa router-view */
.view-container {
  padding: 20px;
  background-color: #f9f9f9;
  min-height: 100vh;
  overflow: hidden;
  /* Tránh tình trạng hiển thị nội dung thừa */
}
</style>
