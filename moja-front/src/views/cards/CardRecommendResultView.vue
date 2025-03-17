<template>
  <div class="recommendation-page">
    <div v-if="loading" class="loading-screen">
      <div class="spinner"></div>
      <p>추천 결과를 불러오는 중입니다... 잠시만 기다려주세요! 😊</p>
    </div>
    <h2 class="title">AI 카드 추천 결과</h2>
    <div class="card-slider-wrapper">
      <div class="card-slider" ref="sliderRef" @mouseenter="stopSliding" @mouseleave="startSliding">
        <div v-for="card in duplicatedCards" :key="card.id" class="card-item">
          <div class="credit-card" @click="moveToDetail(card.id)">
            <img :src="getCardImage(card.card_name)" :alt="card.card_name" class="card-image" />
            <div class="card-info">
              <h5 class="card-title">{{ card.card_name }}</h5>
              <p class="card-company">{{ card.company.name }}</p>
            </div>
            <!-- 툴팁 추가 -->
            <div class="card-tooltip">
              <h6 class="tooltip-title">추천 이유</h6>
              <p class="tooltip-text">{{ card.reason }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCardStore } from "@/stores/card";
import { useRouter } from "vue-router";


export default {
  name: 'CardRecommendation',

  data() {
    return {
      recommendedCards: [],
      summary: {},
      slideTimer: null,
      scrollAmount: 1,
      scrollInterval: 20,
    }
  },

  computed: {
    // Store의 loading 상태 가져오기
    loading() {
      return useCardStore().loading;
    },
    duplicatedCards() {
      return [...this.recommendedCards, ...this.recommendedCards, ...this.recommendedCards];
    }
  },

  methods: {
    moveToDetail(cardId) {
      this.$router.push({ name: 'cardDetail', params: { id: cardId } });
    },

    getCardImage(cardName) {
      const images = import.meta.glob('/src/assets/images/cards/*.{png,jpg,gif}');
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
    },


    startSliding() {
      if (this.slideTimer) return;

      this.slideTimer = setInterval(() => {
        const slider = this.$refs.sliderRef;
        if (!slider) return;

        slider.scrollLeft += this.scrollAmount;

        if (slider.scrollLeft >= slider.scrollWidth / 3) {
          slider.scrollLeft = 0;
        }
      }, this.scrollInterval);
    },

    stopSliding() {
      if (this.slideTimer) {
        clearInterval(this.slideTimer);
        this.slideTimer = null;
      }
    },

    initializeCards() {
      const cardStore = useCardStore();
      this.recommendedCards = cardStore.recommendedCard;
      this.summary = cardStore.summary;  // summary 데이터 가져오기
    },

    formatLabel(key) {
      return key.replace(/([A-Z])/g, ' $1')
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },

    formatValue(value) {
      if (typeof value === 'number') {
        return value.toLocaleString();
      }
      return value;
    }
  },

  mounted() {
    const cardStore = useCardStore();
    // 데이터 로딩이 완료된 후 슬라이더 시작
    this.$watch(
      () => cardStore.loading,
      (newLoading) => {
        if (!newLoading) {
          this.initializeCards();
          this.$nextTick(() => {
            this.startSliding();
          });
        }
      },
      { immediate: true }
    );
  },

  beforeUnmount() {
    this.stopSliding();
  }
}




</script>

<style scoped>
.recommendation-page {
  text-align: center;
  padding: 20px;
  background-color: #f9f9f9;
  min-height: 80vh;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.card-slider-wrapper {
  overflow: hidden;
  position: relative;
  width: 100%;
  margin: 0 auto;
  padding: 20px 0;
}

.card-slider {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding: 20px 40px;
}

.card-slider::-webkit-scrollbar {
  display: none;
}

.card-item {
  flex: 0 0 auto;
  width: 220px;
  perspective: 1000px;
}

.credit-card {
  position: relative;
  width: 100%;
  height: 350px;
  border-radius: 15px;
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  overflow: hidden;
}

/* 툴팁 스타일 */
.card-tooltip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 90%;
  background: rgba(255, 255, 255, 0.95);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  z-index: 10;
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
}

.credit-card:hover .card-tooltip {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
}

.tooltip-title {
  font-size: 1rem;
  color: #333;
  margin-bottom: 8px;
  font-weight: 600;
}

.tooltip-text {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
}

.card-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  text-align: left;
}

.card-title {
  font-size: 1.1rem;
  margin: 0 0 5px 0;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.card-company {
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* Summary 섹션 스타일 */
.summary-section {
  margin-top: 40px;
  padding: 30px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.summary-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 25px;
  text-align: left;
}

.summary-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.summary-item {
  text-align: left;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  transition: transform 0.2s ease;
}

.summary-item:hover {
  transform: translateY(-2px);
}

.summary-label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
}

.summary-value {
  display: block;
  font-size: 1.1rem;
  color: #333;
  font-weight: 600;
}

.loading-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9f9f9;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-top: 5px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loading-screen p {
  margin-top: 20px;
  font-size: 1.2rem;
  color: #333;
}
</style>