import axios from "axios";
import { ref } from "vue";
import { defineStore } from "pinia";
import { useAccountStore } from "./account";

export const useHelpStore = defineStore(
"help",
  () => {
    // 상태 정의
    const helps = ref([]);
    const hotHelps = ref([]); // 이 부분이 빠져있었습니다

    const API_URL = "http://3.37.135.52/boards";
    const HELP_URL = `${API_URL}/help`;
    
    // 질문 게시글 리스트 가져오기
    const getHelps = async () => {
      try {
        const response = await axios.get(`${HELP_URL}/`, {
          headers: {
            Authorization: `Token ${useAccountStore().token}`,
          },
        });
        console.log(response.data);
        helps.value = response.data;
      } catch (error) {
        console.error("질문게시글 리스트 로드 실패:", error);
      }
    };
    
    // HOT 게시글 가져오기
    const getHotHelps = async () => {
      try {
        const response = await axios.get(`${API_URL}/hot-articles/`, {
          headers: {
            // Authorization: `Token ${useAccountStore().token}`,
          },
        });
        console.log('Hot articles:', response.data);
        hotHelps.value = response.data;
      } catch (error) {
        console.error("인기 게시글 로드 실패:", error);
      }
    };
    
    // 질문 게시글 생성
    const createHelp = async (helpData) => {
      try {      
        const response = await axios.post(`${HELP_URL}/`, helpData, {
          headers: {
            Authorization: `Token ${useAccountStore().token}`,
            "Content-Type": "application/json",
          },
        });
        helps.value.unshift(response.data);
        return response.data;
      } catch (error) {
        console.error("질문 생성 실패:", error.response);
        throw error;
      }
    };

    return { 
      helps, 
      hotHelps,
      getHelps, 
      getHotHelps,
      createHelp 
    };
  },
  { persist: true }
);