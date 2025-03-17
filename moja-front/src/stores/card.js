import { defineStore } from "pinia"
import { ref, computed, watch } from 'vue'
import axios from "axios"
import { useRouter } from "vue-router"

export const useCardStore = defineStore('map', () => {
  const recommendedCard = ref([]);
  const bestCard = ref([]);
  const loading = ref(false); // 로딩 상태 추가
  const router = useRouter();

  const recommendCards = async (data) => {
    console.log('ghcnf');
    
    loading.value = true; // 로딩 시작
    router.push('/card/recommend/result'); // 결과 페이지로 이동

    try {
      const response = await axios.post("http://3.37.135.52/cards/recommend/", data);
      recommendedCard.value = response.data.recommendations.recommended_cards;
      console.log("추천 결과:", recommendedCard.value);
    } catch (error) {
      console.error("추천 요청 중 오류 발생:", error);
    } finally {
      loading.value = false; // 로딩 완료
    }
  };

  const bestCards = function () {
    axios({
      url: 'http://3.37.135.52/cards/best/',
      method: 'get'
    })
    .then((res) => {
      bestCard.value = res.data
    })
  }

  return { recommendedCard, recommendCards, loading, bestCards, bestCard };
}, { persist: true });