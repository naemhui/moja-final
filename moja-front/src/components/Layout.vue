<!-- src/components/Layout.vue -->
<template>
  <div class="layout">
    <!-- Header -->
    <Header />

    <!-- 페이지별 콘텐츠 -->
    <main class="main-content">
      <!-- <slot /> -->

      <RouterView/>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import HomeView from '@/views/boards/HomeView.vue';
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
</style>
