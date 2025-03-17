<template>
  <div class="card-detail-container py-5" v-if="product.id">
    <!-- 카드 이미지 섹션 -->
    <div class="card-detail-left">
      <div class="card-image-wrapper">
        <img :src="getCardImage(product.card_name)" alt="카드 이미지" class="card-image" />
      </div>
      <button class="btn btn-outline-secondary mt-1 my-btn" v-if="!isProductSaved && accountStore.token !== ''"
        @click="saveUserProduct(product.id)">
        내 카드 등록하기
      </button>
      <button class="btn btn-danger text-white mt-1 my-btn" v-if="isProductSaved && accountStore.token !== ''"
        @click="deleteUserProduct(product.id)">
        내 카드 삭제하기
      </button>
    </div>

    <!-- 카드 정보 섹션 -->
    <div class="card-detail-right">
      <!-- 상단 정보 -->
      <div class="card-header">
        <h6 class="cashback-info">전월 실적: {{ product.performance }}</h6>
      </div>
      <h2 class="card-title">{{ product.card_name }}</h2>
      <h5 class="card-company text-muted">{{ product.company.name }}</h5>

      <!-- 카드 혜택 -->
      <div class="card-benefits mt-3">
        <h5>💳 카드 혜택</h5>
        <ul>
          <li v-for="option in product.cardoption_set" :key="option.option_category.id">
            <span>{{ getCategoryIcon(option.option_category.option_category) }}</span>
            {{ option.detail }}
          </li>
        </ul>
      </div>

      <!-- 버튼 섹션 -->
      <div class="action-buttons ">
        <a :href="product.company.url" target="_blank" class="btn btn-outline-secondary btn-block">
          카드사 바로가기 <i class="bi bi-arrow-right"></i>
        </a>
        <button class="btn btn-outline-secondary mt-2" @click="toggleModal">
          지점
        </button>
      </div>
    </div>

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
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useAccountStore } from "@/stores/account";
import MapTest from "@/components/MapTest.vue";
import Swal from 'sweetalert2';
const categoryIcons = {
  '통신': '📱',
  '마트/편의점': '🛒',
  '교통': '🚆',
  '주유': '⛽',
  '쇼핑': '🛍️',
  '가맹점': '🏬',
  '무실적': '✔️',
  '여행/숙박': '🏨',
  '간편결제': '💳',
  'PLCC': '🌟',
  '공항라운지/PP': '🛫',
  '항공마일리지': '✈️',
  '영화/문화': '🎬',
  '해외': '🌍',
  '프리미엄': '💎',
  '식음료': '🍽️',
  '생활': '🏠',
  '테마파크': '🎡',
  '적립': '💰',
  '배달앱': '📦',
  '의류': '👗',
  '게임': '🎮',
  '공과금': '🧾',
  '구독': '🔔',
  '종합': '✨',
};

const getCategoryIcon = (category) => {
  return categoryIcons[category] || '✨'; // 기본 이모티콘 설정
};
const route = useRoute();
const cardId = route.params.id;
const accountStore = useAccountStore();

const product = ref({});
const myProduct = ref([]);
const isModalOpen = ref(false);



// 카드 등록 여부
// const isProductSaved = computed(() => {
//   if (!product.value.id || !myProduct.value.length) return false;
  
//   return myProduct.value.some((item) => {
//     return item.card.id === product.value.id
//   });
// });

const isProductSaved = computed(() => {
  if (!product.value.id || !myProduct.value.length) return false;

  // myProduct 배열에서 card와 id를 안전하게 확인
  return myProduct.value.some((item) => item.card && item.card.id === product.value.id);
});

// 모달 열기/닫기
const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value;
};

const images = import.meta.glob('/src/assets/images/cards/*.{png,jpg,gif}');

// 카드 이미지 경로 가져오기
const getCardImage = (cardName) => {
  // 특수문자 제거 및 공백을 "_"로 변환
  const formattedName = cardName.replace(/:/g, '');

  // 파일 경로 확인
  for (const ext of ['png', 'jpg', 'gif']) {
    const path = `/src/assets/images/cards/${formattedName}.${ext}`;
    if (images[path]) {
      return path; // 파일 경로 반환
    }
  }

  // 기본 이미지 반환
  return '/src/assets/images/cards/default.png';
};

const saveUserProduct = async (cardId) => {
  try {
    await axios.post("http://3.37.135.52/cards/user-card/", {
      user_id: accountStore.userId,
      card_id: cardId,
    });
    myProduct.value.push({ card: { id: cardId } });
    Swal.fire({
      title: '카드 등록',
      text: '성공적으로 등록되었어요!',
      icon: 'success', // success, error, warning, info
      confirmButtonText: '확인',
      customClass: {
        confirmButton: 'custom-success-button', // 버튼에 커스텀 클래스 추가
      },
      timer: 2000, // 1초 후에 자동으로 닫힘
  // showConfirmButton: false, // 확인 버튼 숨기기
    })
  } catch (error) {
    Swal.fire({
      title: '삭제실패',
      text: '삭제에 실패했어요!',
      icon: 'error', // success, error, warning, info
      confirmButtonText: '확인',
      customClass: {
        confirmButton: 'custom-warning-button', // 버튼에 커스텀 클래스 추가
      },
      timer: 2000, // 1초 후에 자동으로 닫힘
  // showConfirmButton: false, // 확인 버튼 숨기기
    })
  }
};



// 내 카드 삭제
const deleteUserProduct = async (cardId) => {
  try {
    await axios.delete("http://3.37.135.52/cards/user-card/", {
      data: { card_id: cardId, user_id: accountStore.userId },
    });
    myProduct.value = myProduct.value.filter((item) => item.card.id !== cardId);
    Swal.fire({
      title: '카드 삭제',
      text: '성공적으로 삭제되었어요!',
      icon: 'success', // success, error, warning, info
      confirmButtonText: '확인',
      customClass: {
        confirmButton: 'custom-success-button', // 버튼에 커스텀 클래스 추가
      },
      timer: 2000, // 1초 후에 자동으로 닫힘
  // showConfirmButton: false, // 확인 버튼 숨기기
    })
  } catch (error) {
    Swal.fire({
      title: '삭제실패',
      text: '삭제에 실패했어요!',
      icon: 'error', // success, error, warning, info
      confirmButtonText: '확인',
      customClass: {
        confirmButton: 'custom-warning-button', // 버튼에 커스텀 클래스 추가
      },
      timer: 2000, // 1초 후에 자동으로 닫힘
  // showConfirmButton: false, // 확인 버튼 숨기기
    })
  }
};

// 데이터 로드
onMounted(async () => {
  try {
    const productRes = await axios.get(`http://3.37.135.52/cards/${cardId}/`);
    product.value = productRes.data;

    if (accountStore.userId) {
      const userProductRes = await axios.get("http://3.37.135.52/cards/user-card/", {
        params: { user_id: accountStore.userId },
      });
      myProduct.value = userProductRes.data;
    }
  } catch (error) {
    console.error("데이터 로드 중 에러 발생:", error);
  }
});
</script>

<style scoped>
.card-detail-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.card-detail-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-image-wrapper {
  width: 256px;
  /* 실제 카드 비율 유지 (85.6mm × 54mm) */
  height: 415px;
  border-radius: 8px;
  overflow: hidden;
  /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */
  background-color: #f9f9f9;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  /* 비율 유지하며 컨테이너에 맞춤 */
  background-color: white;
  /* 이미지 부족 시 배경색 */
}

.card-detail-right {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cashback-info {
  color: #6d6d6c;
  font-size: 1rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.card-company {
  font-size: 1rem;
  margin-top: -10px;
}

.card-benefits {
  min-height: 208px;
}

.card-benefits ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.9rem;
}

.card-benefits ul li {
  margin-bottom: 10px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-block {
  display: block;
  width: 100%;
  text-align: center;
}

.btn-outline-warning {
  color: #ff9800;
  border-color: #ff9800;
}

.btn-outline-warning:hover {
  /* background-color: #ff9800; */
  color: #fff;
}

.custom-button {
  background-color: #0d9276;
  border-color: #0d9276;
}

.custom-button:hover {
  background-color: #0b7f63;
  border-color: #0b7f63;
}

.btn-warning {
  background-color: #BBE2EC;
  border-color: #BBE2EC;
  color: #fff;
}

.btn-warning:hover {
  background-color: #ffca2c;
  color: #000;
}

.btn-outline-secondary {
  color: #6d6d6c;
  border: 1px solid #6d6d6c86;
}

.my-btn {
  width: 255px;
}

.card-image-wrapper {
  width: 256px;
  height: 410px;
  max-width: 90%;
  /* 화면 작을 때 유연함 */
  min-width: 180px;
  /* 너무 작아지는 것을 방지 */
}

.card-detail-left {
  flex: 1.2;
  /* 좌측을 조금 더 강조 */
}

.card-detail-right {
  flex: 2.5;
  /* 우측 정보 영역 */
}

.cashback-info {
  color: #999;
  /* 색상을 더 옅게 */
  font-size: 0.875rem;
  /* 작게 만들어 정보 계층을 구분 */
}

.my-btn {
  /* width: 100%; */
  height: 39px;
  text-align: center;
  align-items: center;
  justify-content: center;
  display: flex;
  padding: 10px 20px;
  text-align: center;
  border-radius: 8px;
}

.card-benefits ul li {
  display: flex;
  align-items: center;
  /* 이모티콘과 텍스트 정렬 */
  gap: 8px;
  /* 이모티콘과 텍스트 간격 */
  margin-bottom: 10px;
  font-size: 0.9rem;
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
