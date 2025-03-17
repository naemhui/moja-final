<template>
  <div class="main-cont">

    <div class="container-fluid mt-4">
      <!-- 카드 종류 선택 -->
      <div class="row mb-4">
        <div class="col-md-12">
          <h5 class="section-title">카드 종류 선택</h5>
          <p class="description">체크카드 또는 신용카드 중 선호하는 카드를 선택하세요. 💳</p>
          <div class="btn-group card-type-group">
            <button v-for="type in cardTypes" :key="type.value"
            :class="['btn', 'btn-outline-primary', selectedCardType === type.value ? 'active' : '']"
            @click="selectCardType(type.value)">
            {{ type.label }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 카테고리 선택 -->
    <div class="row mb-4">
      <div class="col-md-12">
        <h5 class="section-title">카테고리 선택 (최대 5개)</h5>
        <p class="description">최대 5개의 혜택 카테고리를 선택하여 추천받을 수 있습니다. 😊</p>
        <div class="grid-container">
          <button v-for="category in categories" :key="category.value" :disabled="isCategoryDisabled(category.value)"
          :class="[
            'btn',
            'btn-outline-primary',
            selectedCategories.includes(category.value) ? 'active' : ''
          ]" @click="toggleCategorySelection(category.value)" data-bs-toggle="tooltip"
            :title="`카테고리: ${category.label}`">
            {{ category.label }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 추천 버튼 -->
    <div class="row">
      <div class="col-md-12 text-center">
        <p class="description">선택이 완료되면 아래 버튼을 눌러 추천 카드를 받아보세요! ✨</p>
        <button class="btn btn-primary recommendation-btn" :disabled="!canRecommend" @click="recommendCards">
          추천 카드 보기 🚀
        </button>
        <p v-if="!canRecommend" class="helper-text">
          (카드 종류와 최소 1개의 카테고리를 선택해주세요.)
        </p>
      </div>
    </div>
    
    <!-- 추천 결과 -->
    <div v-if="recommendationResults" class="recommendation-results mt-5">
      <h5 class="section-title">추천 결과 🎉</h5>
      <p class="description">아래는 추천받은 카드 목록입니다. 👇</p>
      <div class="row g-3">
        <div v-for="card in recommendationResults" :key="card.id" class="col-md-6">
          <div class="card h-100 shadow-sm d-flex flex-column align-items-center">
            <img :src="getCardImage(card.card_name)" alt="card-image" class="card-img-top" />
            <div class="card-body text-center">
              <h5 class="card-title">{{ card.card_name }}</h5>
              <p class="card-subtitle text-muted">{{ card.company.name }}</p>
              <p class="reason mt-2">{{ card.reason }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useCardStore } from "@/stores/card";

const cardStore = useCardStore()

const cardTypes = ref([
  { label: "체크카드", value: 1 },
  { label: "신용카드", value: 2 },
]);

const categories = ref([
  { label: "📱 통신", value: 1 },
  { label: "🛒 마트/편의점", value: 2 },
  { label: "🚆 교통", value: 3 },
  { label: "⛽ 주유", value: 4 },
  { label: "🛍️ 쇼핑", value: 5 },
  { label: "🏬 가맹점", value: 6 },
  { label: "✔️ 무실적", value: 7 },
  { label: "🏨 여행/숙박", value: 8 },
  { label: "💳 간편결제", value: 9 },
  { label: "🌟 PLCC", value: 10 },
  { label: "🛫 공항라운지/PP", value: 11 },
  { label: "✈️ 항공마일리지", value: 12 },
  { label: "🎬 영화/문화", value: 13 },
  { label: "🌍 해외", value: 14 },
  { label: "💎 프리미엄", value: 15 },
  { label: "🍽️ 식음료", value: 16 },
  { label: "🏠 생활", value: 17 },
  { label: "🎡 테마파크", value: 18 },
  { label: "💰 적립", value: 19 },
  { label: "📦 배달앱", value: 20 },
  { label: "👗 의류", value: 21 },
  { label: "🎮 게임", value: 22 },
  { label: "🧾 공과금", value: 23 },
  { label: "🔔 구독", value: 24 },
  { label: "✨ 종합", value: 25 },
]);

const selectedCardType = ref(null);
const selectedCategories = ref([]);
const recommendationResults = ref(null);

// 카드 종류 선택
const selectCardType = (type) => {
  selectedCardType.value = type;
};

// 카테고리 선택
const toggleCategorySelection = (category) => {
  if (selectedCategories.value.includes(category)) {
    selectedCategories.value = selectedCategories.value.filter((c) => c !== category);
  } else if (selectedCategories.value.length < 5) {
    selectedCategories.value.push(category);
  }
};

// 최대 선택 제한
const isCategoryDisabled = (category) => {
  return !selectedCategories.value.includes(category) && selectedCategories.value.length >= 5;
};

// 추천 버튼 활성화 여부
const canRecommend = computed(() => {
  return selectedCardType.value !== null && selectedCategories.value.length > 0;
});

// 추천 요청
const recommendCards = function () {
  cardStore.recommendedCard = []
  const data = {
    card_type: selectedCardType.value,
    preferences: selectedCategories.value,
  }
  console.log(data);
  
  cardStore.recommendCards(data)
};

// 카드 이미지 가져오기
const images = import.meta.glob('/src/assets/images/cards/*.{png,jpg,gif}');
const getCardImage = (cardName) => {
  const formattedName = cardName.replace(/:/g, '');
  for (const ext of ['png', 'jpg', 'gif']) {
    const path = `/src/assets/images/cards/${formattedName}.${ext}`;
    if (images[path]) {
      return path;
    }
  }
  return '/src/assets/images/cards/default.png';
};
</script>

<style scoped>
.main-cont {
  min-height: 80vh;
}
/* 스타일 추가 */
.container-fluid {
  animation: fadeIn 0.5s ease-in-out;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.description {
  font-size: 0.9rem;
  color: #666;
  margin-top: -5px;
  margin-bottom: 15px;
}

.grid-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.grid-container .btn {
  padding: 10px 15px;
  font-size: 1rem;
  border-radius: 10px;
  transition: transform 0.2s ease, background-color 0.3s ease;
}

.grid-container .btn.active {
  background-color: #007bff;
  color: white;
  transform: scale(1.05);
}

.grid-container .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.recommendation-btn {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1.2rem;
  border-radius: 10px;
  background-color: #007bff;
  color: white;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.recommendation-btn:hover:not(:disabled) {
  transform: scale(1.1);
  background-color: #0056b3;
}

.helper-text {
  font-size: 0.85rem;
  color: #999;
  margin-top: 5px;
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.fade-in {
  opacity: 0;
  animation: fadeIn 0.8s ease-in-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 위로 올라오는 애니메이션 */
.animate-up {
  opacity: 0;
  transform: translateY(30px);
  animation: slideUp 0.8s ease-out forwards;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 기타 스타일 */
.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.description {
  font-size: 0.9rem;
  color: #666;
  margin-top: -5px;
  margin-bottom: 15px;
}

.grid-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.grid-container .btn {
  padding: 10px 15px;
  font-size: 1rem;
  border-radius: 10px;
  transition: transform 0.2s ease, background-color 0.3s ease;
}

.grid-container .btn.active {
  background-color: #007bff;
  color: white;
  transform: scale(1.05);
}

.grid-container .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.recommendation-btn {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1.2rem;
  border-radius: 10px;
  background-color: #007bff;
  color: white;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.recommendation-btn:hover:not(:disabled) {
  transform: scale(1.1);
  background-color: #0056b3;
}

.helper-text {
  font-size: 0.85rem;
  color: #999;
  margin-top: 5px;
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
