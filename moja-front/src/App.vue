<template>
  <!-- <Layout/> -->
    <!-- <div>
    <h1>메인</h1>
    <button @click="moveToLogin">로그인</button>
    <button @click="store.logout()">로그아웃</button>
    <button @click="moveToSignin">회원가입</button>
  </div> -->
    <!-- <router-view /> -->

<!-- Layout.vue -->
  <div class="layout">
    <Header />
    <main class="main-content">
      <router-view></router-view>
    </main>
    <MojaModal></MojaModal>
    <Footer />
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAccountStore } from './stores/account';
// import Layout from '@/components/Layout.vue';
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import MojaModal from './components/MojaModal.vue';

const router = useRouter()
const store = useAccountStore()

const moveToLogin = function () {
  router.push({name:'login'})
}
const moveToSignin = function () {
  router.push({name:'signin'})
}


</script>

<style>
@font-face {
  font-family: "TheJamsil5";
  font-style: normal;
  font-weight: 100;
  src: url("@/assets/fonts/The Jamsil 1 Thin.ttf") format("woff2");
}
@font-face {
  font-family: "TheJamsil5";
  font-style: normal;
  font-weight: 300;
  src: url("@/assets/fonts/The Jamsil 2 Light.ttf") format("woff2");
}
@font-face {
  font-family: "TheJamsil5";
  font-style: normal;
  font-weight: 400;
  src: url("@/assets/fonts/The Jamsil 3 Regular.ttf") format("woff2");
}
@font-face {
  font-family: "TheJamsil5";
  font-style: normal;
  font-weight: 500;
  src: url("@/assets/fonts/The Jamsil 4 Medium.ttf") format("woff2");
}
@font-face {
  font-family: "TheJamsil5";
  font-style: normal;
  font-weight: 700;
  src: url("@/assets/fonts/The Jamsil 5 Bold.ttf") format("woff2");
}
@font-face {
  font-family: "TheJamsil5";
  font-style: normal;
  font-weight: 800;
  src: url("@/assets/fonts/The Jamsil 6 ExtraBold.ttf") format("woff2");
}

@font-face {
    font-family: 'Dovemayo-Medium';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.0/Dovemayo-Medium.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
* {
  font-family: 'TheJamsil5';
  font-weight: 400;
}


body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
}

.main-content {
  flex-grow: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0rem 1rem;
}

.btn-group .btn.active {
  background-color: #007bff;
  color: white;
}

.custom-popup {
  border-radius: 15px;
  background-color: #f5f5f5;
}
.custom-warning-button {
  background-color: #dd7979 !important; /* 버튼 배경색 */
  color: white !important;              /* 버튼 텍스트 색상 */
  border: none !important;              /* 버튼 테두리 제거 */
  padding: 10px 20px !important;        /* 버튼 크기 조정 */
  border-radius: 5px !important;        /* 버튼 모서리 둥글게 */
}

.custom-warning-button:hover {
  background-color: #dd7979 !important; /* 버튼 배경색 */
}
.custom-popup {
  border-radius: 15px;
  background-color: #f5f5f5;
}
.custom-success-button {
  background-color: #aee996 !important; /* 버튼 배경색 */
  color: rgba(0, 0, 0, 0.705) !important;              /* 버튼 텍스트 색상 */
  border: none !important;              /* 버튼 테두리 제거 */
  padding: 10px 20px !important;        /* 버튼 크기 조정 */
  border-radius: 5px !important;        /* 버튼 모서리 둥글게 */
}

.custom-success-button:hover {
  background-color: #aee996 !important; /* 버튼 배경색 */
}
.custom-info-button {
  background-color: #bdedfc !important; /* 버튼 배경색 */
  color: rgba(0, 0, 0, 0.705) !important;              /* 버튼 텍스트 색상 */
  border: none !important;              /* 버튼 테두리 제거 */
  padding: 10px 20px !important;        /* 버튼 크기 조정 */
  border-radius: 5px !important;        /* 버튼 모서리 둥글게 */
}

.custom-info-button:hover {
  background-color: #bdedfc !important; /* 버튼 배경색 */
}


</style>