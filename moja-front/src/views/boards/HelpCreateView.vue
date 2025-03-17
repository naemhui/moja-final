<template>
  <div class="help-container">
    <div class="help-header">
      <h1 class="help-title">게시글 작성</h1>
      <router-link to="/help">
        <button class="btn back-btn">목록으로 돌아가기</button>
      </router-link>
    </div>
    <form @submit.prevent="submitHelp" class="create-form">
      <div class="form-group">
        <label for="category">카테고리</label>
        <select v-model="category" required class="category-select">
          <option value="" disabled>카테고리를 선택하세요</option>
          <option v-for="category in categoryOptions"
                :key="category.value"
                :value="category.value">
            {{ category.label }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="title">제목</label>
        <input type="text" v-model="title" required />
      </div>
      <div class="form-group">
        <label for="content">내용</label>
        <textarea v-model="content" required></textarea>
      </div>
      <button type="submit" class="btn">작성하기</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useHelpStore } from "@/stores/help";
import { useRouter } from "vue-router";
import { useAccountStore } from "@/stores/account";
import Swal from 'sweetalert2';

const title = ref("");
const content = ref("");
const category = ref("");
const categoryOptions = ref([
  { label: '도와줘요', value: 'HELP' },
  { label: '추천해요', value: 'RECOM' },
  { label: '함께해요', value: 'TOGETHER' }
]);

const store = useHelpStore();
const accountStore = useAccountStore();
const router = useRouter();

const submitHelp = async () => {
  try {
    // 제목 길이 체크
    if (title.value.length > 255) {
      await Swal.fire({
        title: '제목 길이 초과',
        text: '제목은 255자를 초과할 수 없습니다.',
        icon: 'warning',
        confirmButtonText: '확인',
        timer: 2000,
        customClass: {
          confirmButton: 'custom-warning-button',
          popup: 'custom-popup'
        },
      });
      return;
    }

    // 내용 길이 체크 
    if (content.value.length > 10000) {
      await Swal.fire({
        title: '내용 길이 초과',
        text: '내용은 10000자를 초과할 수 없습니다.',
        icon: 'warning',
        confirmButtonText: '확인',
        timer: 2000,
        customClass: {
          confirmButton: 'custom-warning-button',
          popup: 'custom-popup'
        },
      });
      return;
    }

    const helpData = {
      help_title: title.value,
      help_content: content.value,
      help_category: category.value,
      user: accountStore.userId,
    };

    await store.createHelp(helpData);
    
    // 성공 메시지 표시
    await Swal.fire({
      title: '게시글 작성 완료',
      text: '게시글이 성공적으로 작성되었습니다.',
      icon: 'success',
      confirmButtonText: '확인',
      timer: 1500,
      customClass: {
        confirmButton: 'custom-success-button',
        popup: 'custom-popup'
      },
    });
    
    router.push({ name: "help-list" });

  } catch (error) {
    console.error("질문 생성 중 오류 발생:", error.response?.data || error.message);
    
    const errorData = error.response?.data;
    if (errorData) {
      if (errorData.help_title) {
        await Swal.fire({
          title: '제목 오류',
          text: '제목은 255자를 초과할 수 없습니다.',
          icon: 'error',
          confirmButtonText: '확인',
          timer: 2000,
          customClass: {
            confirmButton: 'custom-warning-button',
            popup: 'custom-popup'
          },
        });
      } else if (errorData.help_content) {
        await Swal.fire({
          title: '내용 오류', 
          text: '내용이 너무 깁니다. 더 짧게 작성해주세요.',
          icon: 'error',
          confirmButtonText: '확인',
          timer: 2000,
          customClass: {
            confirmButton: 'custom-warning-button',
            popup: 'custom-popup'
          },
        });
      } else if (errorData.help_category) {
        await Swal.fire({
          title: '카테고리 오류',
          text: '올바른 카테고리를 선택해주세요.',
          icon: 'error',
          confirmButtonText: '확인',
          timer: 2000,
          customClass: {
            confirmButton: 'custom-warning-button',
            popup: 'custom-popup'
          },
        });
      } else {
        await Swal.fire({
          title: '오류 발생',
          text: '게시글 작성에 실패했습니다. 다시 시도해주세요.',
          icon: 'error',
          confirmButtonText: '확인',
          timer: 2000,
          customClass: {
            confirmButton: 'custom-warning-button',
            popup: 'custom-popup'
          },
        });
      }
    }
  }
};

</script>


<style scoped>
.help-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: bold;
  color: #333;
}

.form-group input,
.form-group textarea,
.category-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.category-select {
  height: 2.5rem;
  background-color: white;
}

.form-group textarea {
  min-height: 200px;
  resize: vertical;
}

.btn {
  background-color: #40A2E3;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}

.btn:hover {
  background-color: #2C7BA8;
}

.help-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4rem;
  margin-bottom: 4rem;
}

.help-title {
  color: #40A2E3;
  text-align: center;
  margin: 0;
  /* margin-bottom: 2rem; */
}

.back-btn {
  display: inline-block;
}
</style>