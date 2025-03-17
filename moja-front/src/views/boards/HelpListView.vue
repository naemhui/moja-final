<template>
  <div class="page-container">

    <!-- Main Content -->
    <main class="main-content">
      <div class="header-section">
        <h1 class="board-title">커뮤니티</h1>
          <button class="create-btn" @click="goToCreate">글쓰기</button>
      </div>

      <!-- 카테고리 필터를 테이블로 -->
      <table class="category-table">
        <tr>
          <td 
            v-for="category in categories" 
            :key="category.value"
            :class="['category-cell', selectedCategory === category.value ? 'active' : '']"
            @click="filterByCategory(category.value)"
          >
            {{ category.label }}
          </td>
        </tr>
      </table>

      <div class="table-container">
        <table class="board-table">
          <thead>
            <tr>
              <th>No</th>
              <th>카테고리</th>
              <th>제목</th>
              <th>닉네임</th>
              <th>작성 날짜</th>
              <th>❤</th>
            </tr>
          </thead>
          <tbody>
            <tr class="tr-cell" v-for="help in filteredHelps" :key="help.id" @click="goToDetail(help.id)">
              <td>{{ help.id }}</td>
              <td>{{ getCategoryLabel(help.help_category) }}</td>
              <td>{{ help.help_title }}</td>
              <td>{{ help.user.nickname }}</td>
              <td>{{ formatDate(help.help_date) }}</td>
              <td>{{ help.like_count }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useHelpStore } from '@/stores/help';
import { useAccountStore } from '@/stores/account';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const store = useHelpStore();
const accountStore = useAccountStore()
const router = useRouter()
// const helps = ref([]);
const selectedCategory = ref(null); // 선택된 카테고리 상태

const goToCreate = function () {
  if (accountStore.token === '') {
    Swal.fire({
      title: '로그인 필요',
      text: '로그인을 해야 글을 작성할 수 있어요!',
      timer: 1500,
      icon: 'error', // success, error, warning, info
      confirmButtonText: '확인',
      customClass: {
        confirmButton: 'custom-warning-button', // 버튼에 커스텀 클래스 추가
      },
    });
  } else {
    router.push({name: 'help-create'})
  }
}
const goToDetail = function (helpId) {
  if (accountStore.token === '') {
    Swal.fire({
      title: '로그인 필요',
      text: '로그인을 해야 게시글을 볼 수 있어요!',
      timer: 1500,
      icon: 'error', // success, error, warning, info
      confirmButtonText: '확인',
      customClass: {
        confirmButton: 'custom-warning-button', // 버튼에 커스텀 클래스 추가
      },
    });
  } else {
    router.push({name: 'help-detail', params:{id: helpId}})
  }
}

onMounted(async () => {
  await store.getHelps()
});

const helps = computed(() => store.helps);

const formatDate = (date) => {
  if (!date) return '';
  return date.split('T')[0];
};

// 카테고리 옵션 정의
const categories = ref([
  { value: null, label: '전체' },
  { value: 'HELP', label: '도와줘요' },
  { value: 'RECOM', label: '추천해요' },
  { value: 'TOGETHER', label: '함께해요' }
]);

// 카테고리 매핑 객체
const categoryMapping = {
  'HELP': '도와줘요',
  'RECOM': '추천해요',
  'TOGETHER': '함께해요'
};

const getCategoryLabel = (category) => {
  return categoryMapping[category] || category;
};

// 필터링된 게시글 목록
const filteredHelps = computed(() => {
  if (!selectedCategory.value) {
    return helps.value; // 전체 선택시 모든 게시글 반환
  }
  return helps.value.filter(help => help.help_category === selectedCategory.value);
});

// 카테고리 필터 함수
const filterByCategory = (category) => {
  selectedCategory.value = category;
};

</script>

<style scoped>
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.page-container {
  min-height: 100vh;
  /* display: flex; */
  flex-direction: column;
  max-width: 1200px; /* 너비 제한 추가 */
  margin: 0 auto; /* 가운데 정렬을 위한 margin 추가 */
  padding: 0 1rem; /* 좌우 여백 추가 */
}

.table-container {
  min-height: 400px; /*테이블 최소 높이 */
  width: 100%;
  margin-top: 1rem;
}

.category-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 1rem;
  table-layout: fixed;
}

.category-cell {
  width: 25%; /* 4개의 카테고리가 균등하게 분할 */
  padding: 0.8rem;
  text-align: center;
  background-color: white;
  border: 1px solid #40A2E3;
  color: #40A2E3;
  cursor: pointer;
  transition: all 0.2s;
}

.category-cell:hover {
  background-color: #e8f4ff;
}

.category-cell.active {
  background-color: #40A2E3;
  color: white;
}

.header {
  background-color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #40A2E3;
}

.nav-links {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}

.nav-item {
  color: #333;
  text-decoration: none;
  font-weight: 500;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: white;
  min-width: 160px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  z-index: 1;
}

.dropdown-content a {
  color: #333;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.main-content {
  flex-grow: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}


.board-title {
  color: #40A2E3;
  font-size: 1.8rem;
  /* margin-bottom: 1.5rem; */
  margin: 0;
}

.create-btn {
  background-color: #40A2E3;
  color: white;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-btn:hover {
  background-color: #2C7BA8;
}

.board-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed; /* 컬럼 너비 고정 */
  border: 1px solid #eee;
}

.board-table th,
.board-table td {
  /* border: 1px solid #eee; /* 모든 셀에 테두리 추가 */
  padding: 1rem;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.board-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  border-bottom: 2px solid #eee;
}

/* 컬럼별 너비 조정 */
.board-table th:nth-child(1),
.board-table td:nth-child(1) {
  width: 7%;
  text-align: center;
}

.board-table th:nth-child(2),
.board-table td:nth-child(2) {
  width: 12%;
  text-align: center;
}

.board-table th:nth-child(3),
.board-table td:nth-child(3) {
  width: 38%;
  text-align: center;
}

.board-table th:nth-child(4) {
  width: 17%;
  text-align: center;
  /* padding-left: 1.5rem; */
}

.board-table td:nth-child(4) {
  width: 15%;
  text-align: center;
  /* padding-left: 1.5rem; */
}

.board-table th:nth-child(5),
.board-table td:nth-child(5) {
  width: 20%;
  text-align: center;
}

.board-table th:nth-child(6),
.board-table td:nth-child(6) {
  width:10%;
  text-align: center;
}

.tr-cell {
  cursor: pointer;
}

.tr-cell:hover {
  color: #40A2E3;
}


.title-cell a {
  color: inherit;
  text-decoration: none;
}

.tr-cell:hover {
  color: #40A2E3;
  /* text-decoration: solid underline #40A2e3 4px; */
}

.category-filter {
  margin-bottom: 2rem;
}

/* .filter-btn {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #40A2E3;
  background-color: white;
  color: #40A2E3;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
} */

.filter-btn:hover {
  background-color: #e8f4ff;
}

.filter-btn.active {
  background-color: #40A2E3;
  color: white;
}

</style>