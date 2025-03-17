<template>

    <div class="product-card" @click="moveToDetail(product.id)">
        <div class="product-info">
            <img :src="`/src/assets/images/banks/${product.bank.bank_name}.png`" alt="" class="bank-logo">
            <div class="product-details">
                <h4>{{ product.prdt_name }}</h4>
                <p>{{ product.bank.bank_name }}</p>
            </div>
            <div class="rate-info">
                <div class="max-rate" v-if="product.product_options.length > 1">최고 {{ product.product_options[1].max_intr_rate }}</div>
                <div class="base-rate">기본 {{ product.product_options[0].intr_rate }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

defineProps({
    product: Object
})

const router = useRouter()

const moveToDetail = function (productId) {
    router.push({name: 'productDetail', params: {id: productId}})
}

</script>

<style scoped>
.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px; /* 패딩을 조금 키움 */
  margin-bottom: 20px; /* 카드 사이 간격 조정 */
  max-width: 700px; /* 최대 너비를 늘림 */
  min-width: 300px; /* 최소 너비 추가 */
  width: 100%; /* 부모 컨테이너에 맞춰 크기를 유동적으로 조정 */
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  background-color: #f8f9fa;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-info {
  display: flex;
  align-items: center;
  gap: 20px; /* 요소 간 간격 늘림 */
}

.bank-logo {
  width: 60px; /* 로고 크기 증가 */
  height: 60px;
  border-radius: 50%;
}

.product-details h4 {
  font-size: 1.2em; /* 제목 폰트 크기 증가 */
  margin: 0 0 5px;
  white-space: normal; /* 줄바꿈 허용 */
}

.product-details p {
  font-size: 1em;
  margin: 0;
  color: #777;
}

.rate-info {
  text-align: right;
  font-size: 1em; /* 금리 정보 가독성 증가 */
}

@media (max-width: 768px) {
  .product-card {
    padding: 15px; /* 모바일에서는 패딩 줄임 */
    margin-bottom: 15px;
  }

  .product-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .bank-logo {
    width: 50px;
    height: 50px;
  }

  .product-details h4 {
    font-size: 1.1em;
  }

  .rate-info {
    font-size: 0.9em;
  }
}

@media (max-width: 576px) {
  .product-card {
    padding: 10px;
    max-width: 100%;
  }

  .bank-logo {
    width: 40px;
    height: 40px;
  }

  .product-details h4 {
    font-size: 1em;
  }

  .product-details p {
    font-size: 0.9em;
  }

  .rate-info {
    font-size: 0.8em;
  }
}


</style>