<!-- components/RateChart.vue -->
<template>
  <div class="rate-chart-section">
    <div class="chart-container" v-if="chartData.length > 0">
      <div class="chart-title">금리 비교</div>
      <div class="chart">
        <div v-for="item in chartData" :key="item.id" class="chart-item">
          <div class="bar-group">
            <div
              class="bar max-rate"
              :style="{ height: `${item.maxRate * 10}%` }"
              :class="{ 'animate-bar': animate }"
            >
              <span class="rate-label">{{ item.maxRate }}%</span>
            </div>
            <div
              class="bar min-rate"
              :style="{ height: `${item.minRate * 10}%` }"
              :class="{ 'animate-bar': animate }"
            >
              <span class="rate-label">{{ item.minRate }}%</span>
            </div>
          </div>
          <div class="product-label">
            <div class="product-name">{{ item.name }}</div>
            <div class="bank-name">{{ item.bank }}</div>
          </div>
        </div>
      </div>
      <div class="chart-legend">
        <div class="legend-item">
          <div class="legend-color max-rate"></div>
          <span>최고금리</span>
        </div>
        <div class="legend-item">
          <div class="legend-color min-rate"></div>
          <span>최저금리</span>
        </div>
      </div>
    </div>
    <div v-else class="no-data">데이터가 없습니다.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
});

const chartData = ref([]);
const animate = ref(false);

const processChartData = () => {
  chartData.value = props.products
    .filter((item) => item?.product?.product_options?.length > 0)
    .map((item) => {
      const rates = item.product.product_options.map(
        (opt) => parseFloat(opt.max_intr_rate) || 0
      );
      return {
        id: item.id,
        name: item.product.prdt_name,
        maxRate: Math.max(...rates),
        minRate: Math.min(...rates),
        bank: item.product.bank?.bank_name || "",
      };
    });
};

watch(
  () => props.products,
  () => {
    processChartData();
  },
  { deep: true }
);

onMounted(() => {
  processChartData();
  setTimeout(() => {
    animate.value = true;
  }, 100);
});
</script>

<style scoped>
.rate-chart-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #333;
}

.chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 300px;
  gap: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.chart-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.bar-group {
  display: flex;
  gap: 8px;
  height: 100%;
  align-items: flex-end;
}

.bar {
  width: 40px;
  position: relative;
  transition: height 1s ease;
  opacity: 0;
  transform: translateY(100%);
}

.animate-bar {
  opacity: 1;
  transform: translateY(0);
}

.max-rate {
  background: #3e9278;
}

.min-rate {
  background: #eeba4c;
}

.rate-label {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  color: #666;
}

.product-label {
  margin-top: 1rem;
  text-align: center;
  width: 120px;
}

.product-name {
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bank-name {
  font-size: 0.8rem;
  color: #666;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>
