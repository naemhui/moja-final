// import { defineStore } from 'pinia'
// import axios from 'axios'

// export const useCardStore = defineStore('card', {
//   state: () => ({
//     popularCards: [],
//     recommendedCards: [],
//   }),
//   actions: {
//     async fetchCards() {
//       try {
//         const response = await axios.get('http://127.0.0.1:8000/api/main-page/')
//         this.popularCards = response.data.popular_cards
//         this.recommendedCards = response.data.recommended_cards
//       } catch (error) {
//         console.error('카드 데이터를 가져오는 중 오류:', error)
//       }
//     },
//   },
// }, { persist: true })
