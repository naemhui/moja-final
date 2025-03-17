<template>
  <div>
    <ProductRecommendList :recommendProductLists="financeStore.recommendProductLists"/>
  </div>
</template>

<script setup>
import ProductRecommendList from '@/components/financese/ProductRecommendList.vue';
import { useFinanceStore } from '@/stores/finance';
const financeStore = useFinanceStore()

</script>

<style scoped>

</style>