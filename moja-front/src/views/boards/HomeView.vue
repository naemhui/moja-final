<template>
  <div class="home-container mb-5">
    <!-- Main Banner -->
    <section class="banner-section">
      <div class="banner-content">
        <div class="banner-grid">
          <div class="banner-text">
            <h1 class="nowrap">모으자 자산!<br />모르겠다 자산관리!</h1>
            <p class="nowrap">
              간단한 과정을 거쳐 최적의 상품을 추천받을 수 있습니다.
            </p>
            <button @click="startRecommendation" class="start-button" v-if="accountStore.token === ''">
              시작하기
            </button>
          </div>
          <div class="banner-image">
            <img src="/src/assets/images/boards/mainmoney.png" alt="메인 이미지" class="main-money-image" />
          </div>
        </div>
      </div>
    </section>

    <!-- 카드 슬라이더 -->
    <!-- <section class="card-section">
      <div class="card-slider-wrapper">
        <div class="card-slider" ref="sliderRef" @mouseenter="stopSliding" @mouseleave="startSliding">
          <div class="card-item" v-for="card in duplicatedCards" :key="card.id">
            <img :src="getCardImage(card.card_name)" :alt="card.card_name" class="card-image" />
          </div>
        </div>
      </div>
    </section> -->

    <section class="card-section">
      <!-- 필터 탭 -->
      <div class="tabs">
        <button class="tab-button" :class="{ active: selectedTab === 'check_cards' }" @click="changeTab('check_cards')">
          체크카드
        </button>
        <button class="tab-button" :class="{ active: selectedTab === 'credit_cards' }"
          @click="changeTab('credit_cards')">
          신용카드
        </button>
      </div>

      <!-- 카드 슬라이더 -->
      <div class="card-slider-wrapper mb-5">
        <div class="card-slider" ref="sliderRef" @mouseenter="stopSliding" @mouseleave="startSliding">
          <div class="card-item" v-for="(card, index) in displayedCards" :key="index">
            <img :src="getCardImage(card.card_name)" :alt="card.card_name" class="card-image"
              @click="moveToCardDetail(card.id)" />
          </div>
        </div>
      </div>
    </section>

    <div class="main-content">
      <!-- 하단 콘텐츠 섹션 -->
      <div class="bottom-container">
        <!-- HOT 게시글 -->
        <div class="hot-posts-section">
          <div class="cap-decoration"></div>
          <h2 class="section-title">🔥 HOT 게시글</h2>
          <div class="post-list">
            <div class="post-item" v-for="(post, index) in hotHelps" :key="post.id" @click="goToDetail(post.id)"
              style="cursor: pointer">
              <div class="post-content">
                <span class="post-badge">👑 TOP{{ index + 1 }}</span>
                <p class="hot-title">{{ post.help_title }}</p>
                <p class="hot-content">{{ post.help_content }}</p>
              </div>
              <div class="post-stats">
                <span>❤️ {{ post.like_count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 오른쪽 섹션 -->
        <div class="right-section">
          <News :newsData="articles" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useHelpStore } from "@/stores/help";
import MoneyChangeView from "../exchange/MoneyChangeView.vue";
import MapTest from "@/components/MapTest.vue";
import { useAccountStore } from "@/stores/account";
import Swal from "sweetalert2";
import axios from "axios";
import News from "@/components/News.vue";

const isModalOpen = ref(false);
const isExchange = ref(false);
const isMap = ref(false);
const accountStore = useAccountStore();

// 카드 데이터
const checkCards = ref([]);
const creditCards = ref([]);

const articles = ref([]);
const loading = ref(true);
const error = ref(null);

// API 호출 함수
const fetchArticles = async () => {
  try {
    const response = await axios.get("http://3.37.135.52/articles/get/");
    articles.value = response.data; // 받아온 데이터를 저장
  } catch (err) {
    error.value = "데이터를 가져오는 중 오류가 발생했습니다.";
    console.error(err);
  } finally {
    loading.value = false; // 로딩 종료
  }
};



const moveToCardDetail = function (cardId) {
  if (accountStore.token === '') {
    Swal.fire({
      title: '로그인 필요',
      text: '로그인을 해야 카드 정보를 볼 수 있어요 😥',
      icon: 'error', // success, error, warning, info
      confirmButtonText: '확인',
      timer: 1500,
      customClass: {
        confirmButton: 'custom-warning-button', // 버튼에 커스텀 클래스 추가
      },
    });
  } else {
    router.push({ name: 'cardDetail', params: { id: cardId } })
  }
}

// 현재 선택된 탭
const selectedTab = ref("check_cards");

const displayedCards = computed(() => {
  const cards =
    selectedTab.value === "check_cards" ? checkCards.value : creditCards.value;
  return [...cards, ...cards, ...cards]; // 데이터 3배 복제
});



const images = import.meta.glob('/src/assets/images/cards/*.{png,jpg,gif}');
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

const cards = ref([
  { card_name: "Card 1", company: { name: "Company A" } },
  { card_name: "Card 2", company: { name: "Company B" } },
  { card_name: "Card 3", company: { name: "Company C" } },
]);

const sliderRef = ref(null);
const slideTimer = ref(null);
const scrollAmount = 1; // 스크롤 속도
const scrollInterval = 20; // 스크롤 간격(ms)

// 카드 배열을 반복적으로 사용하여 무한 스크롤 구현
const duplicatedCards = ref([]);

const fetchCards = async () => {
  try {
    const response = await axios.get("http://3.37.135.52/cards/best/");
    checkCards.value = response.data.check_cards;
    creditCards.value = response.data.credit_cards;

    // 초기화: 선택된 탭에 따라 중복 카드 배열 생성
    duplicatedCards.value = [
      ...checkCards.value,
      ...checkCards.value,
      ...checkCards.value,
    ];
  } catch (error) {
    console.error("카드 데이터를 불러오는 중 오류 발생:", error);
  }
};

// 무한 스크롤 시작
const startSliding = () => {
  if (slideTimer.value) return;

  slideTimer.value = setInterval(() => {
    if (sliderRef.value) {
      sliderRef.value.scrollLeft += 1; // 스크롤 속도

      // 끝까지 스크롤되면 다시 처음으로 이동
      if (
        sliderRef.value.scrollLeft >=
        sliderRef.value.scrollWidth / 3 // 원래 데이터 길이만큼 스크롤되었을 때
      ) {
        sliderRef.value.scrollLeft = 0; // 처음으로 초기화
      }
    }
  }, 20); // 스크롤 간격(ms)
};

const stopSliding = () => {
  if (slideTimer.value) {
    clearInterval(slideTimer.value);
    slideTimer.value = null;
  }
};


const updateCards = () => {
  const cards = selectedTab.value === "check_cards" ? checkCards.value : creditCards.value;
  duplicatedCards.value = [...cards, ...cards, ...cards];
};

watch(selectedTab, updateCards);

const changeTab = (tab) => {
  selectedTab.value = tab;
};


// 컴포넌트 해제 시 스크롤 중단
onUnmounted(() => {
  stopSliding();
});

const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleButtonClick = (action) => {
  console.log(`Selected action: ${action}`);
  // 각 버튼에 대한 동작 구현
  closeModal();
};

const openExchange = function () {
  isExchange.value = !isExchange.value;
  console.log(isExchange.value);
};

const openMap = function () {
  isMap.value = !isMap.value;
  console.log(isMap.value);
};

// HOT 게시글 데이터
const router = useRouter();
const store = useHelpStore();
const hotHelps = computed(() => store.hotHelps);

// 게시글 상세 페이지로 이동하는 함수
const goToDetail = (id) => {
  router.push({
    name: "help-detail",
    params: { id: id },
  });
};

onMounted(async () => {
  fetchArticles();
  await store.getHotHelps();
  await fetchCards();
  updateCards();
  startSliding();
});

const startRecommendation = () => {
  Swal.fire({
    title: "시작하기",
    text: "회원가입부터 시작해봐요!",
    icon: "info", // success, error, warning, info
    confirmButtonText: "확인",
    customClass: {
      confirmButton: "custom-info-button", // 버튼에 커스텀 클래스 추가
    },
    timer: 1500,
  }).then(() => {
    // 2초 딜레이 후 이동
    setTimeout(() => {
      router.push("/account/signin");
    }, 200); // 2000ms = 2초
  });
};

const goToProductRecommend = function () {
  if (accountStore.token === "") {
    Swal.fire({
      title: "로그인 필요",
      text: "로그인을 안 하신 것 같아요!",
      icon: "error", // success, error, warning, info
      confirmButtonText: "확인",
      timer: 1500,
      customClass: {
        confirmButton: "custom-warning-button", // 버튼에 커스텀 클래스 추가
      },
    });
  } else {
    router.push("/product/recommend");
  }
};
</script>

<style scoped>
/*  */
.tabs {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  /* 왼쪽 정렬 */
  padding: 10px 20px;
  border-bottom: 1px solid #ddd;
  /* 탭 구분선 */
  gap: 20px;
}

/* 탭 버튼 기본 스타일 */
.tab-button {
  font-size: 1.2rem;
  font-weight: 600;
  color: #999;
  /* 비활성화된 탭 색상 */
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px 0;
  position: relative;
  transition: color 0.3s ease;
}

/* 활성화된 탭 스타일 */
.tab-button.active {
  color: #000;
  /* 활성화된 탭 글자 색상 */
}

.tab-button.active::after {
  content: "";
  /* 밑줄 추가 */
  position: absolute;
  left: 0;
  bottom: -5px;
  width: 100%;
  height: 2px;
  background: #000;
  /* 밑줄 색상 */
}


/* 카드 섹션 */
.card-section {
  margin-top: 10px;
  padding: 20px;
  background-color: white;
}

.card-slider-wrapper {
  overflow: hidden;
  position: relative;
  width: 100%;
  background-color: white;
  padding: 10px 0;
}

.card-slider {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-behavior: smooth;
}

.card-slider::-webkit-scrollbar {
  display: none;
  /* 스크롤바 제거 */
}

.card-item {
  flex: 0 0 auto;
  width: 180px;
  height: 280px;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/*  */
.home-container {
  width: 100%;
}

.banner-section {
  background-color: #fff6e9;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  padding: 1rem 0;
  overflow: hidden;
  /* 텍스트가 배너 밖으로 넘어가는 것을 방지 */
}

.banner-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.banner-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 2rem;
}

.banner-text {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* .nowrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
} */

.banner-text h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.banner-text p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.banner-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-money-image {
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

.start-button {
  background-color: #0d9276;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
  white-space: nowrap;
}

.start-button:hover {
  background-color: #0b7b63;
  transform: translateY(-2px);
}

.main-content {
  max-width: 1200px;
  margin: auto;
  padding: 0rem 1rem;
}

.bottom-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

/* HOT 게시글 스타일 */
/* HOT 게시글 스타일 수정 */
.hot-posts-section {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-item {
  background: #ffffff;
  border-radius: 12px;
  padding: 0.25rem;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  background: #f8f9fa;
}

.post-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #40A2E3;
}


.post-badge {
  background: linear-gradient(135deg, #40A2E3, #5fb8ff);
  color: white;
  margin: 0.4rem 0.4rem;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  width: fit-content;
  box-shadow: 0 2px 4px rgba(64, 162, 227, 0.2);
}

.post-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.hot-title {
  font-size: 1.2rem;
  color: #2c3e50;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
  padding: 0.25rem 1rem;
}

.hot-content {
  font-size: 0.9rem;
  color: #5d666e;
  margin: 0;
  font-weight: 400;
  padding: 0rem 1.3rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  max-height: 2.8em;
  /* line-height * 2줄 */
}

.post-stats {
  margin: 0.5rem 0.5rem;
  display: flex;
  justify-content: flex-end;
  color: #40A2E3;
  font-size: 0.9rem;
  font-weight: 500;
}

.post-stats span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: #f8f9fa;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
}

/* 오른쪽 섹션 스타일 */
.right-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.challenge-section {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.challenge-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
}

.challenge-badge {
  font-weight: 500;
  margin-right: 1rem;
}

.challenge-progress,
.challenge-total {
  font-size: 0.9rem;
  color: #666;
}

.challenge-description {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

/* 추천받기 버튼 스타일 */
.recommendation-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  position: relative;
  padding-bottom: 2rem;
  /* 모자 아이콘을 위한 여백 */
}

.rec-button {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #a0a0a0;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.rec-button:hover {
  background-color: #0d9276;
  transform: translateY(-2px);
}

.button-text-long {
  display: inline-block;
}

.button-text-short {
  display: none;
}

.fixed-cap-icon {
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 999;
}

.cap-icon {
  width: 100px;
  height: 100px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cap-icon:hover {
  transform: scale(1.1);
}

/* 모달 애니메이션 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from {
  opacity: 0;
  transform: translate(10px);
}

.modal-leave-to {
  opacity: 0;
  transform: translate(10px);
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(128, 128, 128, 0.3);
  /* #0D9276 with opacity */
  backdrop-filter: blur(2px);
  display: block;
  z-index: 1000;
}

.modal-content {
  position: absolute;
  bottom: 120px;
  /* 모자 아이콘 위치보다 위에 */
  right: 0;
  width: 200px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  padding: 0.8rem;
  /* background: #40A2E3; */
  padding: 0.8rem;
  text-align: center;
  background: #fff;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #333;
  font-weight: 600;
}

.modal-body {
  padding: 0.8rem;
}

.modal-button {
  display: block;
  width: 100%;
  padding: 0.8rem;
  margin: 0.3rem 0;
  border: none;
  border-radius: 8px;
  background-color: #b4bbc0;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  text-align: center;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: white;
  opacity: 0.8;
  transition: all 0.2s ease;
  padding: 0 0.5rem;
}

.close-button:hover {
  opacity: 1;
  transform: rotate(90deg);
}

.modal-button:hover {
  background-color: #40a2e3;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

/* .modal-button:hover {
  background-color: #0D9276;
} */

.modal-button:active {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .banner-text h1 {
    font-size: calc(1.5rem + 1vw);
  }

  .banner-text p {
    font-size: calc(0.9rem + 0.5vw);
  }
}

@media (max-width: 768px) {
  .fixed-cap-icon {
    bottom: 20px;
    right: 20px;
  }

  .cap-icon {
    width: 100px;
    height: 100px;
  }

  .modal-content {
    bottom: 80px;
    right: 20px;
    width: 180px;
  }

  .banner-section {
    padding: 1.5rem 0;
  }

  .banner-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .banner-text h1,
  .banner-text p,
  .banner-image {
    display: none;
  }

  .banner-text {
    gap: 0;
  }

  .start-button {
    font-size: 1rem;
    padding: 1rem 1.8rem;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
  }

  .button-text-long {
    display: none;
  }

  .button-text-short {
    display: inline-block;
  }

  .rec-button {
    padding: 0.8rem;
    font-size: 0.9rem;
  }
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
.exchange-modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* 헤더 */
.exchange-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 10px;
}

/* 닫기 버튼 */
.exchange-btn-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.exchange-modal-footer {
  text-align: right;
}

.map-modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* 헤더 */
.map-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 10px;
}

/* 닫기 버튼 */
.map-btn-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.map-modal-footer {
  text-align: right;
}

.hot-posts-section {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: visible;
}

.cap-decoration {
  position: absolute;
  top: -45px;
  left: -12px;
  width: 70px;
  height: 70px;
  background-image: url('@/assets/images/boards/cap_reverse.png');
  background-size: contain;
  background-repeat: no-repeat;
  transform: rotate(-13deg);
  z-index: 1;
}
</style>