<template>
  <div class="recommendation-page container">
    <h1>예/적금 추천</h1>
    <p>혜택이 모자라~~</p>

    <!-- 상품 선택 -->
    <div class="select-container mb-5">
      <label for="product-type">상품 선택</label>
      <select id="product-type" v-model="productType">
        <option value="예금">예금</option>
        <option value="적금">적금</option>
      </select>
    </div>

    <!-- 월 저축액 슬라이더 -->
    <div class="slider-container mb-5">
      <label for="monthly-saving">월 저축액</label>
      <div class="slider">
        <input
          id="monthly-saving"
          type="range"
          v-model="monthlySaving"
          min="50000"
          max="5000000"
          step="50000"
        />
        <span>{{ formatCurrency(monthlySaving) }}원</span>
      </div>
    </div>

    <!-- 저축기간 슬라이더 -->
    <div class="slider-container mb-5">
      <label for="saving-period">저축기간</label>
      <div class="slider">
        <input
          id="saving-period"
          type="range"
          v-model="savingPeriod"
          min="6"
          max="36"
          step="6"
        />
        <span>{{ savingPeriod }}개월</span>
      </div>
    </div>

    <button class="custom-button mb-5" @click="sendRecommend">추천</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useFinanceStore } from "@/stores/finance";
import Swal from 'sweetalert2';
import { useAccountStore } from "@/stores/account";

const productType = ref("예금"); // 기본값: 적금
const monthlySaving = ref(125000);
const savingPeriod = ref(6);
const accountStore = useAccountStore()

function formatCurrency(value) {
  return value.toLocaleString();
}


Swal.fire({
      title: '설명',
      text: '간단한 과정으로 최적의 상품을 추천 받을 수 있어요!',
      icon: 'info', // success, error, warning, info
      confirmButtonText: '확인',
      customClass: {
        confirmButton: 'custom-info-button', // 버튼에 커스텀 클래스 추가
      },
      timer: 1500, // 1초 후에 자동으로 닫힘
  // showConfirmButton: false, // 확인 버튼 숨기기
    })

const sendRecommend = function () {
  const financeStore = useFinanceStore()
  console.log(accountStore.birthDate)
  const data = {
    category: productType.value,
    save_money: monthlySaving.value,
    save_trm: savingPeriod.value,
    user_birthday: accountStore.birthDate
  }
  console.log(data);
  
  financeStore.recommendProduct(data)
}
</script>

<style scoped>
/* 페이지 컨테이너 스타일 */
.recommendation-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

/* 헤더 스타일 */
h1 {
  font-size: 2rem;
  margin-bottom: 20px;
}

p {
  font-size: 1rem;
  color: #555;
  margin-bottom: 20px;
}

/* 선택 상자 */
.select-container {
  margin-bottom: 20px;
  text-align: left;
}

.select-container label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.select-container select {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

/* 슬라이더 */
.slider-container {
  margin-bottom: 20px;
  text-align: left;
}

.slider-container label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

.slider {
  display: flex;
  align-items: center;
}

.slider input {
  flex: 1;
  margin-right: 10px;
}

.slider span {
  min-width: 80px;
  text-align: right;
}

/* 버튼 스타일 */
.custom-button {
  background-color: #0D9276;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.custom-button:hover {
  background-color: #0B7F63;
}
</style>

