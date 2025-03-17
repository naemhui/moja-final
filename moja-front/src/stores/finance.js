import { ref } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import axios from "axios";

export const useFinanceStore = defineStore("finance", () => {
  // API URL
  const FINANCE_URL = "http://3.37.135.52/finances";

  // 추천 상품 리스트 상태
  const recommendProductLists = ref([]);

  const selectedProduct = ref()

  // 추천 상품 요청 함수
  const router = useRouter()
  const recommendProduct = async (inputData) => {
    try {
      const response = await axios.post(`${FINANCE_URL}/recommend/`, inputData);
      recommendProductLists.value = response.data.recommended_products; // 서버에서 받은 데이터 저장
      console.log("추천 상품 리스트:", recommendProductLists.value.category_based_recommendations);
      
      router.push({name:'productRecommendResult'})
      
    } catch (error) {
      console.error("추천 상품 요청 오류:", error);
    }
  };

  // 반환되는 항목 (스토어 외부에서 접근 가능)
  return { recommendProduct, recommendProductLists, selectedProduct};
}, { persist: true });
