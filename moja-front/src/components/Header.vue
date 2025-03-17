<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light">
      <div class="container-fluid">
        <!-- 로고 -->
        <router-link to="/" class="navbar-brand d-flex align-items-center">
          <span class="fs-4">🧢 MOJA</span>
        </router-link>

        <!-- 토글 버튼 (작은 화면) -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- 네비게이션 -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <!-- 커뮤니티 -->
            <li class="nav-item">
              <router-link to="/help" class="nav-link d-flex align-items-center">
                <!-- <img src="/src/assets/images/boards/community.png" alt="커뮤니티" class="icon" /> -->
                <span class="ms-2">커뮤니티</span>
                <span class="d-lg-none ms-2">커뮤니티</span>
              </router-link>
            </li>
            <!-- 프로필 -->
            <!-- 랭킹: 넣을지 안 넣을지 고민 중 -->
            <!-- <li class="nav-item">
              <router-link to="/ranking" class="nav-link d-flex align-items-center">
                <img src="/image/ranking.png" alt="랭킹" class="icon" />
                <span class="d-lg-none ms-2">랭킹</span>
              </router-link>
            </li> -->
            
            <li class="nav-item">
              <RouterLink to="/product" class="nav-link d-flex align-items-center">
                <span>예적금</span>
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/card" class="nav-link d-flex align-items-center">
                <span>카드</span>
              </RouterLink>
            </li>
            <li class="nav-item" v-if="accountStore.token === ''">
              <a class="nav-link d-flex align-items-center">
                <!-- <img src="" alt="로그인" class="icon d-lg-none" /> -->
                
                <span @click="toggleModal">로그인</span>
              </a>
            </li>
            
            <li class="nav-item" v-if="accountStore.token !== ''" @click="logout">
              <a class="nav-link d-flex align-items-center">
                <!-- <img src="" alt="로그인" class="icon d-lg-none" /> -->
                <span>로그아웃</span>
              </a>
            </li>
            <li class="nav-item">
              <router-link to="/profile" class="nav-link d-flex align-items-center">
                <img src="/src/assets/images/boards/profile.png" alt="프로필" class="icon" />
                <span class="d-lg-none ms-2">프로필</span>
              </router-link>
            </li>
          </ul>
        </div>
        <div v-if="accountStore.isSuccess" class="modal-backdrop">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">로그인</h3>
        </div>
        <div class="modal-body">
          <Login/>
        </div>
        <div class="modal-footer d-flex justify-content-between mt-4">
          <button class="btn btn-secondary larger-button" @click="moveToSignIn">회원가입</button>
          <button class="btn btn-secondary larger-button" @click="toggleModal">닫기</button>
        </div>
      </div>
    </div>
      </div>
      <!-- <a href="#" class="nav-item">모자 챌린지</a> -->
    </nav>
  </header>
</template>

<script setup>
import { useAccountStore } from '@/stores/account';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Login from '@/components/Login.vue'
const accountStore = useAccountStore()
const isModalOpen = ref(false)
import Swal from 'sweetalert2';

const toggleModal = function () {
  accountStore.isSuccess = !accountStore.isSuccess
}

const router = useRouter()

const moveToSignIn = function () {
  accountStore.isSuccess = false
  router.push('/account/signin')
}


const logout = function () {
  axios({
    url: `http://3.37.135.52/accounts/dj-rest-auth/logout/`,
    method: 'post'
  })

  Swal.fire({
        title: '로그아웃',
        text: '😊 다음에 또 오세요!! 😊',
        icon: 'success', // success, error, warning, info
        confirmButtonText: '확인',
      timer: 1500,
        customClass: {
          confirmButton: 'custom-success-button', // 버튼에 커스텀 클래스 추가
        },
      });

  accountStore.token = ''
  accountStore.userId = 0
}

</script>

<style scoped>


.icon {
  width: 20px;
  height: 20px;
}

.nav-link span {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.nav-link:hover span {
  color: #40a2e3;
}

.d-lg-none {
  display: none !important;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 모달 내용 */
.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* 헤더 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 10px;
}

/* 닫기 버튼 */
.btn-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.modal-footer {
  text-align: right;
}

.larger-button {
  width: 150px;
  font-size: 16px; /* 폰트 크기 증가 */
}

@media (max-width: 992px) {
  .d-lg-none {
    display: inline !important;
  }
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
</style>
