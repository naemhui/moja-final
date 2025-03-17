<!-- views/finances/ProductDetailView.vue -->
<template>
  <div class="child-container py-5" v-if="product.id">
    <!-- 상품 정보 카드 -->
    <div class="card mb-4 shadow-sm">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-auto">
            <img :src="`/src/assets/images/banks/${product.bank.bank_name}.png`" alt="은행 로고" class="rounded-circle" />
          </div>
          <div class="col">
            <h5 class="mb-0">{{ product.prdt_name }}</h5>
            <small class="text-muted">{{ product.bank.bank_name }}</small>
          </div>
          <div class="col-auto text-start">
            <div class="d-flex flex-column align-items-start">
              <p>🔼 최고 금리: {{ highestOption.max_intr_rate }}% (기간: {{ highestOption.save_trm }}개월)</p>
              <p>🔽 최저 금리: {{ lowestOption.max_intr_rate }}% (기간: {{ lowestOption.save_trm }}개월)</p>
            </div>
          </div>
        </div>
        <hr />
        <!-- 상세 정보 -->
        <div class="row">
          <div class="col-12">
            <p>📅 <b>가입기간</b>: {{ product.product_options[0].save_trm }}개월 ~ {{
    product.product_options[product.product_options.length - 1].save_trm }}개월</p>
            <p v-if="product.max_limit !== null">💰 <b>최대 가입금액</b>: {{ formatMaxLimit(product.max_limit) }}</p>
            <p v-else>💰 <b>최대 가입금액</b>: 제한 없음</p>
            <p>👤 <b>대상</b>: {{ product.join_member }}</p>
            <p>🏦 <b>가입방법</b>: {{ product.join_way }}</p>
          </div>
        </div>
        <div class="d-flex justify-content-between mt-3">
          <a :href="product.bank.bank_url" class="btn btn-outline-secondary flex-grow-1 me-1">은행사 바로가기</a>
          <button class="btn btn-outline-secondary flex-grow-1 ms-1" @click="toggleModal">지점 검색하기</button>
        </div>
      </div>
    </div>

    <!-- 모달 -->
    <div v-if="isModalOpen" class="modal-backdrop">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">지점 검색</h5>
        </div>
        <div class="modal-body">
          <MapTest />
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="toggleModal">닫기</button>
        </div>
      </div>
    </div>

    <!-- 추가정보 섹션 -->
    <div v-if="isLoaded" class="card p-4 border-dashed">
      <div class="row">
        <div class="col-12">
          <h5>💱 만기 후 이자율 조건</h5>
          <p v-html="formatText(product.mtrt_int)"></p>
          <h5>⭐ 특별 조건</h5>
          <p v-html="formatText(product.spcl_cnd)"></p>
          <h5>📋 기타</h5>
          <p>{{ product.etc_note }}</p>
        </div>
      </div>
      <!-- 버튼 -->
      <button class="btn custom-button text-white" v-if="!isProductSaved && accountStore.token !== ''"
        @click="saveUserProduct(product.id)">
        내 상품 등록하기
      </button>
      <button class="btn btn-danger text-white" v-if="isProductSaved && accountStore.token !== ''"
        @click="deleteUserProduct(product.id)">
        내 상품 삭제하기
      </button>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useAccountStore } from '@/stores/account';
import MapTest from '@/components/MapTest.vue';
import Swal from 'sweetalert2';

const route = useRoute();
const productId = route.params.id;
const accountStore = useAccountStore();

const product = ref({});
const highestOption = ref({});
const lowestOption = ref({});
const myProduct = ref([]); // 유저가 등록한 상품 리스트
const isLoaded = ref(false); // 데이터 로딩 완료 여부
const isModalOpen = ref(false); // 모달 상태

// 현재 상품이 등록된 상태인지 계산
const isProductSaved = computed(() => {
  if (!product.value.id || !myProduct.value.length) return false;
  return myProduct.value.some((item) => item.product.id === product.value.id);
});

const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value;
};

const saveUserProduct = async (productId) => {
  try {
    await axios.post("http://3.37.135.52/finances/user-product/", {
      user_id: accountStore.userId,
      product_id: productId,
    });
    // 새로 등록된 상품 추가
    myProduct.value.push({ product: { id: productId } });
    Swal.fire({
      title: '상품 등록 성공',
      text: '내 상품 등록 성공했어요!',
      icon: 'success', // success, error, warning, info
      confirmButtonText: '확인',
      timer: 1500,
      customClass: {
        confirmButton: 'custom-success-button', // 버튼에 커스텀 클래스 추가
      },
    });
  } catch (error) {
    Swal.fire({
      title: '에러 발생',
      text: '내 상품 등록 실패했어요 :(',
      icon: 'error', // success, error, warning, info
      confirmButtonText: '확인',
      timer: 1500,
      customClass: {
        confirmButton: 'custom-warning-button', // 버튼에 커스텀 클래스 추가
      },
    });
  }
};

const deleteUserProduct = async (productId) => {
  try {
    await axios.delete("http://3.37.135.52/finances/user-product/", {
      data: { product_id: productId, user_id: accountStore.userId },
    });
    // 상품 목록 갱신
    myProduct.value = myProduct.value.filter((item) => item.product.id !== productId);
    Swal.fire({
      title: '삭제 성공',
      text: '내 상품 삭제 성공했어요!',
      icon: 'success', // success, error, warning, info
      confirmButtonText: '확인',
      timer: 1500,
      customClass: {
        confirmButton: 'custom-success-button', // 버튼에 커스텀 클래스 추가
      },
    });
  } catch (error) {
    Swal.fire({
      title: '에러 발생',
      text: '내 상품 삭제 실패했어요 :(',
      icon: 'error', // success, error, warning, info
      confirmButtonText: '확인',
      timer: 1500,
      customClass: {
        confirmButton: 'custom-warning-button', // 버튼에 커스텀 클래스 추가
      },
    });
  }
};

onMounted(async () => {
  try {
    // 상품 상세 정보 로드
    const productRes = await axios.get(`http://3.37.135.52/finances/product/detail/${productId}`);
    product.value = productRes.data;

    if (product.value.product_options?.length > 0) {
      const options = product.value.product_options;
      highestOption.value = options.reduce((max, opt) => (opt.max_intr_rate > max.max_intr_rate ? opt : max), options[0]);
      lowestOption.value = options.reduce((min, opt) => (opt.max_intr_rate < min.max_intr_rate ? opt : min), options[0]);
    }

    // 유저가 등록한 상품 리스트 로드
    if (accountStore.userId) {
      const userProductRes = await axios.get("http://3.37.135.52/finances/user-product/", {
        params: { user_id: accountStore.userId },
      });
      myProduct.value = userProductRes.data;
    }

    isLoaded.value = true;
  } catch (error) {
    console.error("데이터 로드 중 에러 발생:", error);
  }
});

function formatText(text) {
  if (!text) return "";
  return text.replace(/\n/g, "<br>");
}

function formatMaxLimit(maxLimit) {
  if (maxLimit === null) {
    return "제한 없음";
  }
  if (maxLimit >= 100000000) {
    return `${Math.floor(maxLimit / 100000000)}억 ${Math.floor((maxLimit % 100000000) / 10000)}만원`;
  } else if (maxLimit >= 10000) {
    return `${Math.floor(maxLimit / 10000)}만원`;
  }
  return `${maxLimit}원`;
}

</script>


<style scoped>
body,
html {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  width: 100%;
}

.child-container {
  max-width: 900px;
  /* 중앙 콘텐츠의 최대 너비 */
  margin: 0 auto;
  /* 가로 방향으로 중앙 정렬 */
  padding: 20px;
  /* 내부 여백 */
  display: flex;
  /* 내용 정렬을 위해 flexbox 사용 */
  flex-direction: column;
  /* 세로 정렬 */
  align-items: center;
  /* 수평 중앙 정렬 */
  justify-content: center;
  /* 수직 중앙 정렬 */
  min-height: 100vh;
  /* 화면 전체 높이를 차지 */
}

.card {
  max-width: 700px;
  word-wrap: break-word;
  /* 긴 단어 줄바꿈 */
  word-break: break-word;
  /* 단어가 너무 길 경우 줄바꿈 */
  overflow-wrap: break-word;
  /* 텍스트가 넘칠 경우 줄바꿈 */
}

p {
  white-space: normal;
  /* 텍스트가 기본적으로 줄바꿈 가능 */
}

.custom-button {
  background-color: #0D9276;
  /* 버튼 배경 색상 */
  border-color: #0D9276;
  /* 버튼 테두리 색상 */
}

.custom-button:hover {
  background-color: #0B7F63;
  /* 호버 시 색상 */
  border-color: #0B7F63;
}

.high-button {
  background-color: #0D9276;
  /* 버튼 배경 색상 */
  border-color: #0D9276;
  /* 버튼 테두리 색상 */
}

.btn-outline-secondary:hover {
  background-color: #40A2E3;
  border: #40A2E3;
}




.border-dashed {
  border: 2px dashed #ccc;
}

.card-body img {
  width: 60px;
  height: 60px;
}

.card-body {
  max-width: 800px;
  /* 최대 크기 제한 */
  /* width: 600px; */
  padding: 20px;
  /* 내부 여백 조절 */
  margin: auto;
  /* 가운데 정렬 */
}


/* 모달 */
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
  max-width: 800px;
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
</style>
