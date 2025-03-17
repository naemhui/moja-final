<template>
  <div class="comparison-page container">
    <h1 class="main-title">상품 비교</h1>
    <p class="subtitle">혜택이 모자라~~</p>

    <!-- 선택된 상품 카드들 -->
    <div class="selected-products d-flex justify-content-between">
      <div
        class="product-card"
        v-for="(product, index) in selectedProducts"
        :key="product.id"
        :class="{ selected: selectedProductId === product.id }"
        @click="selectProduct(product)"
      >
        <div class="card-content">
          <img
            :src="`/src/assets/images/banks/${product.bank.bank_name}.png`"
            alt="은행 로고"
            class="bank-logo"
          />
          <div class="product-info">
            <h5 class="product-name">{{ product.prdt_name }}</h5>
            <p class="bank-name">{{ product.bank.bank_name }}</p>
            <p class="interest-rate">
              금리:<span class="rate-value">{{ getInterestRate(product, savingPeriod) ? getInterestRate(product, savingPeriod) + "%" : "정보 없음" }}</span>
            </p>
            <p>
              기간: {{
                product.product_options
                  ? Math.min(...product.product_options.map((option) => option.save_trm)) + " ~ " +
                    Math.max(...product.product_options.map((option) => option.save_trm)) + "개월"
                  : "정보 없음"
              }}
            </p>
            <p>가입 방법: {{ product.join_way || "정보 없음" }}</p>
            <p>기타: {{ product.etc_note || "정보 없음" }}</p>
          </div>
          <div class="total-amount mt-3">
            예상: <strong>{{ formatCurrency(getTotalAmount(product)) }}원</strong>
          </div>
        </div>
      </div>
    </div>

    <!-- 월 저축액 및 저축기간 슬라이더 -->
    <div class="sliders mt-4">
      <div class="slider-container">
        <label for="monthly-saving">월 저축액</label>
        <input
          type="range"
          id="monthly-saving"
          v-model="monthlySaving"
          :min="50000"
          :max="5000000"
          step="50000"
        />
        <span>{{ formatCurrency(monthlySaving) }}원</span>
      </div>

      <div class="slider-container">
        <label for="saving-period">저축기간</label>
        <input
          type="range"
          id="saving-period"
          v-model="savingPeriod"
          :min="1"
          :max="60"
          step="1"
        />
        <span>{{ savingPeriod }}개월</span>
      </div>
    </div>

    <!-- Footer Buttons -->
    <div class="footer-buttons mt-4 d-flex justify-content-between">
      <button class="btn btn-secondary" @click="goBack">이전으로</button>
      <button class="btn btn-primary" :disabled="!selectedProductId" @click="goToProductDetail">
        선택하기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useFinanceStore } from "@/stores/finance";
import Swal from 'sweetalert2';

Swal.fire({
      title: '설명',
      text: '월 저축액과 저축기간을 바꿔보며 비교할 수 있어요!',
      icon: 'info', // success, error, warning, info
      confirmButtonText: '확인',
      customClass: {
        confirmButton: 'custom-info-button', // 버튼에 커스텀 클래스 추가
      },
      timer: 2000, // 1초 후에 자동으로 닫힘
  // showConfirmButton: false, // 확인 버튼 숨기기
    })


// Router 및 Store 활용
const router = useRouter();
const financeStore = useFinanceStore();

// 선택된 상품 데이터
const selectedProducts = financeStore.selectedProduct;

// 선택된 상품 ID 저장
const selectedProductId = ref(null);

// 슬라이더 값
const monthlySaving = ref(1000000); // 기본 월 저축액
const savingPeriod = ref(12); // 기본 저축 기간

// 상품 클릭 시 선택/해제 동작
const selectProduct = (product) => {
  if (selectedProductId.value === product.id) {
    selectedProductId.value = null; // 이미 선택된 경우 선택 해제
  } else {
    selectedProductId.value = product.id; // 새 상품 선택
  }
};

// 금리 가져오기 (기간 기반)
const getInterestRate = (product, period) => {
  if (!product.product_options) return null;

  // 입력된 기간과 가장 가까운 기간의 금리를 반환
  const closestOption = product.product_options.reduce((prev, curr) =>
    Math.abs(curr.save_trm - period) < Math.abs(prev.save_trm - period) ? curr : prev
  );

  return closestOption.max_intr_rate;
};

// 총 금액 계산
const getTotalAmount = (product) => {
  const interestRate = getInterestRate(product, savingPeriod.value) || 0;
  const principal = monthlySaving.value * savingPeriod.value; // 원금
  const interest = principal * (interestRate / 100); // 이자
  return principal + interest; // 총 금액
};

// 금액 포맷
const formatCurrency = (value) => {
  return value.toLocaleString();
};

// 뒤로가기
const goBack = () => {
  router.push({ name: "productRecommendResult" });
};

// 선택된 상품 상세보기로 이동
const goToProductDetail = () => {
  router.push({
    name: "productDetail",
    params: { id: selectedProductId.value },
  });
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  padding: 20px;
}

.main-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.subtitle {
  color: #555;
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.selected-products {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: left;
  flex: 1;
  cursor: pointer;
  min-height: 300px; /* 고정된 높이 추가 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-card.selected {
  border-color: #0d9276;
}

.bank-logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.product-info {
  text-align: left;
  flex-grow: 1;
}

.product-name {
  font-weight: bold;
  margin: 0 0 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* 긴 텍스트 생략 */
}

.interest-rate {
  font-size: 16px;
  font-weight: bold;
  display: inline-block;
}

.rate-value {
  font-size: 20px;
  font-weight: bold;
  color: #e34045;
  margin-left: 2px; /* 간격 최소화 */
}

.total-amount {
  font-size: 1.2rem;
  font-weight: bold;
  color: #406ee3;
}

.sliders {
  margin-top: 20px;
  text-align: left;
}

.slider-container {
  margin-bottom: 15px;
}

.slider-container label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.slider-container input {
  background-color: green;
  width: 100%;
  margin-bottom: 5px;
}

.footer-buttons button {
  width: 150px;
}
</style>
