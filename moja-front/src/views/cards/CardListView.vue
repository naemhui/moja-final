<template>
    <div class="col-md-9 content-field">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h2>카드 목록</h2>
        </div>
    </div>

    <div class="container-fluid mt-4">
        <!-- 필터 영역 -->
        <div class="row mb-4 filter-container">
            <div class="row align-items-center mb-4">
                <!-- 카드 종류 선택 -->
                <div class="col-md-4 card-type-filter">
                    <h5>카드 종류 선택</h5>
                    <div class="btn-group">
                        <button v-for="type in cardTypes" :key="type.value"
                            :class="['btn', 'btn-outline-primary', selectedCardType === type.value ? 'active' : '']"
                            @click="filterByCardType(type.value)">
                            {{ type.label }}
                        </button>
                    </div>
                </div>
                <!-- 카드 검색 -->
                <div class="col-md-8 search-section">
                    <h5 class="ms-2 mt-4">카드 검색</h5>
                    <input type="text" class="form-control filter-input ms-2" placeholder="카드명을 입력하세요"
                        v-model="searchKeyword" @input="filterBySearch" />
                </div>
            </div>
            <div class="col-md-12 mt-4">
                <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
                    <!-- 카테고리 선택 -->
                    <div class="category-filter mb-4 ms-1">
                        <h5>카테고리 선택</h5>
                        <div class="grid-container">
                            <button v-for="category in categories" :key="category.value"
                                :class="['btn', 'btn-outline-primary', selectedCategory === category.value ? 'active' : '']"
                                @click="filterByCategory(category.value)">
                                {{ category.label }}
                            </button>
                        </div>
                    </div>
                    <!-- 카드사 선택 -->
                    <div class="bank-filter mb-0 ms-1">
                        <h5>카드사 선택</h5>
                        <div class="d-flex flex-wrap gap-2">
                            <div v-for="company in companies" :key="company.id"
                                :class="['bank-item', selectedCompanies.includes(company.name) ? 'active' : '']"
                                @click="filterByCompany(company.name)">
                                <img :src="`/src/assets/images/companies/${company.name}.png`" alt="logo"
                                    class="bank-logo" />
                                {{ company.name }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 콘텐츠 영역 -->
        <div class="row g-4">
            <div v-for="card in filteredList" :key="card.id" class="col-md-6">
                <div class="card h-100 shadow-sm d-flex flex-row align-items-center" @click="moveToDetail(card.id)">
                    <!-- 카드 이미지 -->
                    <img :src="getCardImage(card.card_name)" alt="card-image" class="card-img-left" />
                    <!-- 카드 정보 -->
                    <div class="card-body">
                        <h5 class="card-title">{{ card.card_name }}</h5>
                        <p class="card-subtitle text-muted">{{ card.company.name }}</p>
                        <div class="benefit-info mt-2">
                            <h6>혜택</h6>
                            <ul>
                                <li v-for="option in card.cardoption_set" :key="option.id">
                                    <span>{{ getCategoryIcon(option.option_category.option_category) }}</span>
                                    {{ option.option_category.option_category }}: {{ option.detail }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>



<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

// 데이터 초기화
const searchKeyword = ref('');
const selectedCategory = ref(null);
const selectedCompanies = ref([]);
const cardList = ref([]);
const filteredList = ref([]);
const selectedCardType = ref(null); // 카드 종류 선택 상태 추가

const cardTypes = ref([
    { label: '전체', value: null },
    { label: '체크카드', value: 1 },
    { label: '신용카드', value: 2 },
]);

const categoryIcons = {
    '통신': '📱',          // 통신
    '마트/편의점': '🛒',   // 마트/편의점
    '교통': '🚆',          // 교통
    '주유': '⛽',          // 주유
    '쇼핑': '🛍️',         // 쇼핑
    '가맹점': '🏬',        // 가맹점
    '무실적': '✔️',        // 무실적
    '여행/숙박': '🏨',     // 여행/숙박
    '간편결제': '💳',      // 간편결제
    'PLCC': '🌟',          // PLCC
    '공항라운지/PP': '🛫', // 공항라운지/PP
    '항공마일리지': '✈️',  // 항공마일리지
    '영화/문화': '🎬',     // 영화/문화
    '해외': '🌍',          // 해외
    '프리미엄': '💎',      // 프리미엄
    '식음료': '🍽️',       // 식음료
    '생활': '🏠',          // 생활
    '테마파크': '🎡',      // 테마파크
    '적립': '💰',          // 적립
    '배달앱': '📦',        // 배달앱
    '의류': '👗',          // 의류
    '게임': '🎮',          // 게임
    '공과금': '🧾',        // 공과금
    '구독': '🔔',          // 구독
    '종합': '✨',          // 종합
};
const getCategoryIcon = (category) => {
    return categoryIcons[category] || '✨'; // 기본 이모티콘: ✨
};


const categories = ref([
    { label: '전체', value: null },
    { label: '📱 통신', value: 1 },         // 통신
    { label: '🛒 마트/편의점', value: 2 },  // 마트/편의점
    { label: '🚆 교통', value: 3 },         // 교통
    { label: '⛽ 주유', value: 4 },         // 주유
    { label: '🛍️ 쇼핑', value: 5 },        // 쇼핑
    { label: '🏬 가맹점', value: 6 },       // 가맹점
    { label: '✔️ 무실적', value: 7 },       // 무실적
    { label: '🏨 여행/숙박', value: 8 },    // 여행/숙박
    { label: '💳 간편결제', value: 9 },     // 간편결제
    { label: '🌟 PLCC', value: 10 },        // PLCC
    { label: '🛫 공항라운지/PP', value: 11 }, // 공항라운지/PP
    { label: '✈️ 항공마일리지', value: 12 }, // 항공마일리지
    { label: '🎬 영화/문화', value: 13 },   // 영화/문화
    { label: '🌍 해외', value: 14 },        // 해외
    { label: '💎 프리미엄', value: 15 },    // 프리미엄
    { label: '🍽️ 식음료', value: 16 },     // 식음료
    { label: '🏠 생활', value: 17 },        // 생활
    { label: '🎡 테마파크', value: 18 },    // 테마파크
    { label: '💰 적립', value: 19 },        // 적립
    { label: '📦 배달앱', value: 20 },      // 배달앱
    { label: '👗 의류', value: 21 },        // 의류
    { label: '🎮 게임', value: 22 },        // 게임
    { label: '🧾 공과금', value: 23 },      // 공과금
    { label: '🔔 구독', value: 24 },        // 구독
    { label: '✨ 종합', value: 25 },        // 종합
]);

const companies = ref([
    {
        "id": 1,
        "name": "신한카드",
        "url": "https://www.shinhancard.com/"
    },
    {
        "id": 2,
        "name": "삼성카드",
        "url": "https://www.samsungcard.com/"
    },
    {
        "id": 3,
        "name": "현대카드",
        "url": "https://www.hyundaicard.com/"
    },
    {
        "id": 4,
        "name": "우리카드",
        "url": "https://pc.wooricard.com/"
    },
    {
        "id": 5,
        "name": "국민카드",
        "url": "https://card.kbcard.com/"
    },
    {
        "id": 6,
        "name": "롯데카드",
        "url": "https://www.lottecard.co.kr/"
    },
    {
        "id": 7,
        "name": "하나카드",
        "url": "https://www.hanacard.co.kr/"
    },
    {
        "id": 8,
        "name": "농협카드",
        "url": "https://card.nonghyup.com/"
    },
    {
        "id": 9,
        "name": "ibk카드",
        "url": "https://www.ibk.co.kr/card/mainList.ibk"
    },
    {
        "id": 10,
        "name": "BC카드",
        "url": "https://www.bccard.com/app/card/MainActn.do"
    }
]);

import { useAccountStore } from '@/stores/account';
import Swal from 'sweetalert2';

const accountStore = useAccountStore()
// 카드 상세 페이지 이동
const moveToDetail = (cardId) => {
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
        router.push({ name: 'cardDetail', params: { id: cardId } });
    }
};

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

const adjustImageOrientation = (event) => {
    const image = event.target;
    const { naturalWidth, naturalHeight } = image;

    // 가로 이미지를 세로로 보정
    if (naturalWidth > naturalHeight) {
        image.style.transform = 'rotate(90deg)';
    }
};

// 검색 필터
const filterBySearch = () => applyFilters();
const filterByCategory = (category) => {
    selectedCategory.value = category;
    applyFilters();
};
const filterByCardType = (cardType) => {
    selectedCardType.value = cardType;
    applyFilters();
};
const filterByCompany = (companyName) => {
    if (selectedCompanies.value.includes(companyName)) {
        selectedCompanies.value = selectedCompanies.value.filter((name) => name !== companyName);
    } else {
        selectedCompanies.value.push(companyName);
    }
    applyFilters();
};

const applyFilters = () => {
    filteredList.value = cardList.value.filter((card) => {
        const matchesSearch = !searchKeyword.value || card.card_name.includes(searchKeyword.value);

        const matchesCategory = !selectedCategory.value ||
            card.cardoption_set.some(option => option.option_category.id === selectedCategory.value);

        const matchesCardType = !selectedCardType.value || card.card_category === selectedCardType.value;

        const matchesCompany = !selectedCompanies.value.length || selectedCompanies.value.includes(card.company.name);

        return matchesSearch && matchesCategory && matchesCardType && matchesCompany;
    });
};

// 데이터 가져오기
onMounted(() => {
    axios.get('http://3.37.135.52/cards/').then((res) => {
        cardList.value = res.data;
        filteredList.value = res.data;
    });
});
</script>

<style scoped>
.filter-container {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    border: 1px solid #ddd;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
}

/* 공통 필터 타이틀 스타일 */
.card-type-filter h5,
.category-filter h5,
.bank-filter h5,
.search-section h5 {
    font-size: 1.2rem;
    margin-bottom: 10px;
}

.card-type-filter .btn-group,
.category-filter .grid-container {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

/* 버튼 스타일 */
.btn {
    padding: 8px 12px;
    font-size: 0.9rem;
    border-radius: 8px;
    background: white;
    border: 1px solid #ccc;
    transition: background-color 0.2s ease, border-color 0.2s ease;
}

.btn.active {
    background-color: #007bff;
    color: white;
    border-color: #0056b3;
}

.category-filter .grid-container {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 10px;
}

.category-filter .grid-container::-webkit-scrollbar {
    height: 6px;
    /* 스크롤바 높이 */
}

.category-filter .grid-container::-webkit-scrollbar-thumb {
    background-color: #ccc;
    /* 스크롤바 색상 */
    border-radius: 3px;
}

.bank-filter .bank-item {
    flex-basis: auto;
    display: flex;
    align-items: center;
    padding: 10px;
    gap: 8px;
    border-radius: 8px;
    border: 1px solid #ccc;
    background-color: white;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease;
}

.bank-filter .bank-item:hover {
    background-color: #f1f1f1;
}

.bank-filter .bank-item.active {
    border: 2px solid #007bff;
    background-color: #e9f5ff;
}

/* 카드 리스트 스타일 */
.card {
    display: flex;
    flex-direction: row;
    gap: 16px;
    border-radius: 10px;
    background-color: #fff;
    padding: 12px;
    border: 1px solid #ddd;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 카드 이미지 */
.card-img-left {
    width: 130px;
    height: 180px;
    object-fit: cover;
    border-radius: 8px;
    background-color: #f9f9f9;
}

/* 카드 본문 */
.card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/* 혜택 정보 */
.benefit-info ul {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 0.9rem;
    max-height: 100px;
    overflow-y: auto;
}

.benefit-info ul li {
    display: flex;
    align-items: flex-start;
    margin-bottom: 5px;
    gap: 8px;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-word;
}

.benefit-info ul li span {
    flex-shrink: 0;
    margin-right: 8px;
}

/* 검색 섹션 */
.search-section {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.search-section .filter-input {
    width: 100%;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 1rem;
    border: 1px solid #ccc;
}

@media (max-width: 768px) {
    .card-img-left {
        width: 100px;
        height: 140px;
    }
}

.search-section {
    flex-basis: 100%;
}

.btn {
    font-size: 0.8rem;
    padding: 6px 10px;
}

.category-filter .grid-container {
    flex-wrap: wrap;
    /* 작은 화면에서는 줄바꿈 허용 */
    overflow-x: hidden;
    /* 스크롤 제거 */
}
</style>
