<template>
  <div class="news-section">
    <div class="cap-decoration"></div>
    <h2 class="section-title">😴 배워보자 오늘의 지식</h2>
    <div class="news-list">
      <div
        class="news-item"
        v-for="(news, index) in newsData"
        :key="news.url"
        @click="openNews(news.url)"
      >
        <div class="news-content">
          <span class="news-badge">👀 No.{{ index + 1 }}</span>
          <p class="news-title">{{ news.title }}</p>
          <p class="news-summary">{{ summarizeContent(news.content) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  newsData: {
    type: Array,
    required: true,
  },
});

const summarizeContent = (content) => {
  return content.length > 80 ? content.substring(0, 80) + "..." : content;
};

const openNews = (url) => {
  window.open(url, "_blank");
};

const randomLikes = () => {
  return Math.floor(Math.random() * 100) + 1;
};
</script>

<style scoped>
.news-section {
  min-width: 700px;
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
  background-image: url('@/assets/images/boards/news.png');
  background-size: contain;
  background-repeat: no-repeat;
  transform: rotate(-13deg);
  z-index: 1;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.news-item {
  background: #ffffff;
  border-radius: 12px;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  position: relative;
  background: #f8f9fa;
}

.news-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #40a2e3;
}

.news-badge {
  background: linear-gradient(135deg, #40a2e3, #5fb8ff);
  color: white;
  margin: 0.4rem 0.4rem;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  width: fit-content;
  box-shadow: 0 2px 4px rgba(64, 162, 227, 0.2);
}

.news-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.news-title {
  font-size: 1.2rem;
  color: #2c3e50;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
  padding: 0.25rem 1rem;
}

.news-summary {
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
}

.news-stats {
  margin: 0.5rem 0.5rem;
  display: flex;
  justify-content: flex-end;
  color: #40a2e3;
  font-size: 0.9rem;
  font-weight: 500;
}

.news-stats span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: #f8f9fa;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
}
</style>
