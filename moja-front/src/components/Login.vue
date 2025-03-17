<template>
    <div class="login-container">
      <form @submit.prevent="login" class="login-form">
        <label for="userId" class="form-label">아이디</label>
        <input id="userId" type="text" v-model="userId" class="form-input" placeholder="아이디를 입력하세요" />
  
        <label for="password" class="form-label">비밀번호</label>
        <input id="password" type="password" v-model="password" class="form-input" placeholder="비밀번호를 입력하세요" />
  
        <button type="submit" class="form-submit">로그인</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useAccountStore } from "@/stores/account";
  
  const userId = ref("");
  const password = ref("");
  const store = useAccountStore();
  
  const login = function () {
    const loginData = { userId: userId.value, password: password.value };
    store.login(loginData);
  };
  </script>
  
  <style scoped>
  /* 전체 컨테이너 스타일 */
  .login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    text-align: center;
    font-family: Arial, sans-serif;
  }
  
  /* 타이틀 스타일 */
  .login-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
  }
  
  /* 폼 스타일 */
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  /* 라벨 스타일 */
  .form-label {
    text-align: left;
    font-size: 14px;
    color: #555;
    margin-bottom: 5px;
  }
  
  /* 입력 필드 스타일 */
  .form-input {
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;
    transition: border-color 0.3s ease;
  }
  
  .form-input:focus {
    border-color: #0d6efd;
  }
  
  /* 버튼 스타일 */
  .form-submit {
    padding: 10px;
    font-size: 16px;
    color: #fff;
    background-color: #0d6efd;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .form-submit:hover {
    background-color: #0b5ed7;
  }
  
  </style>
  