<template>
  <div class="currency-converter">
    <!-- 사용자 입력 (금액) -->
    <div>
      <label for="amount">금액</label>
      <input type="number" v-model="amount" id="amount" placeholder="금액을 입력하세요" />
    </div>

    <!-- 출발 통화 선택 -->
    <div>
      <label for="fromCurrency">출발 통화</label>
      <select v-model="fromCurrency" id="fromCurrency">
        <option v-for="currency in exchangeRates" :key="currency.id" :value="currency.cur_unit">
          {{ currency.cur_nm }}
        </option>
      </select>
    </div>

    <!-- 목표 통화 선택 -->
    <div>
      <label for="toCurrency">목표 통화</label>
      <select v-model="toCurrency" id="toCurrency">
        <option v-for="currency in exchangeRates" :key="currency.id" :value="currency.cur_unit">
          {{ currency.cur_nm }}
        </option>
      </select>
    </div>

    <!-- 환율 계산 결과 -->
    <div v-if="convertedAmount !== null">
      <h3>변환된 금액: {{ convertedAmount }} {{ toCurrency }}</h3>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';

// 제공된 환율 데이터
const exchangeRates = ref([]);

onMounted(() => {
  axios({
    url: `http://3.37.135.52/finances/exchange/`,
    method: 'get'
  })
    .then((res) => {
      exchangeRates.value = res.data;
    })
    .catch((err) => {
      exchangeRates.value = [
        {
          "result": 1,
          "cur_unit": "AED",
          "ttb": "377.48",
          "tts": "385.11",
          "deal_bas_r": "381.3",
          "bkpr": "381",
          "yy_efee_r": "0",
          "ten_dd_efee_r": "0",
          "kftc_bkpr": "381",
          "kftc_deal_bas_r": "381.3",
          "cur_nm": "아랍에미리트 디르함"
        },
        {
          "result": 1,
          "cur_unit": "AUD",
          "ttb": "907.04",
          "tts": "925.37",
          "deal_bas_r": "916.21",
          "bkpr": "916",
          "yy_efee_r": "0",
          "ten_dd_efee_r": "0",
          "kftc_bkpr": "916",
          "kftc_deal_bas_r": "916.21",
          "cur_nm": "호주 달러"
        },
        {
          "result": 1,
          "cur_unit": "BHD",
          "ttb": "3,677.8",
          "tts": "3,752.09",
          "deal_bas_r": "3,714.95",
          "bkpr": "3,714",
          "yy_efee_r": "0",
          "ten_dd_efee_r": "0",
          "kftc_bkpr": "3,714",
          "kftc_deal_bas_r": "3,714.95",
          "cur_nm": "바레인 디나르"
        },
        {
          "result": 1,
          "cur_unit": "BND",
          "ttb": "1,032.31",
          "tts": "1,053.16",
          "deal_bas_r": "1,042.74",
          "bkpr": "1,042",
          "yy_efee_r": "0",
          "ten_dd_efee_r": "0",
          "kftc_bkpr": "1,042",
          "kftc_deal_bas_r": "1,042.74",
          "cur_nm": "브루나이 달러"
        },
        {
          "result": 1,
          "cur_unit": "CAD",
          "ttb": "994.5",
          "tts": "1,014.59",
          "deal_bas_r": "1,004.55",
          "bkpr": "1,004",
          "yy_efee_r": "0",
          "ten_dd_efee_r": "0",
          "kftc_bkpr": "1,004",
          "kftc_deal_bas_r": "1,004.55",
          "cur_nm": "캐나다 달러"
        },
        {
          "result": 1,
          "cur_unit": "CHF",
          "ttb": "1,555.49",
          "tts": "1,586.92",
          "deal_bas_r": "1,571.21",
          "bkpr": "1,571",
          "yy_efee_r": "0",
          "ten_dd_efee_r": "0",
          "kftc_bkpr": "1,571",
          "kftc_deal_bas_r": "1,571.21",
          "cur_nm": "스위스 프랑"
        },
        {
          "result": 1,
          "cur_unit": "CNH",
          "ttb": "191.05",
          "tts": "194.9",
          "deal_bas_r": "192.98",
          "bkpr": "192",
          "yy_efee_r": "0",
          "ten_dd_efee_r": "0",
          "kftc_bkpr": "192",
          "kftc_deal_bas_r": "192.98",
          "cur_nm": "위안화"
        },
        {
          "result": 1,
          "cur_unit": "DKK",
          "ttb": "194.76",
          "tts": "198.69",
          "deal_bas_r": "196.73",
          "bkpr": "196",
          "yy_efee_r": "0",
          "ten_dd_efee_r": "0",
          "kftc_bkpr": "196",
          "kftc_deal_bas_r": "196.73",
          "cur_nm": "덴마아크 크로네"
        },
        {
          "result": 1,
          "cur_unit": "EUR",
          "ttb": "1,452.55",
          "tts": "1,481.9",
          "deal_bas_r": "1,467.23",
          "bkpr": "1,467",
          "yy_efee_r": "0",
          "ten_dd_efee_r": "0",
          "kftc_bkpr": "1,467",
          "kftc_deal_bas_r": "1,467.23",
          "cur_nm": "유로"
        },
        {
          "result": 1,
          "cur_unit": "GBP",
          "ttb": "1,744.97",
          "tts": "1,780.22",
          "deal_bas_r": "1,762.6",
          "bkpr": "1,762",
          "yy_efee_r": "0",
          "ten_dd_efee_r": "0",
          "kftc_bkpr": "1,762",
          "kftc_deal_bas_r": "1,762.6",
          "cur_nm": "영국 파운드"
        },
        {
          "result": 1,
          "cur_unit": "HKD",
          "ttb": "178.13",
          "tts": "181.72",
          "deal_bas_r": "179.93",
          "bkpr": "179",
          "yy_efee_r": "0",
          "ten_dd_efee_r": "0",
          "kftc_bkpr": "179",
          "kftc_deal_bas_r": "179.93",
          "cur_nm": "홍콩 달러"
        },
        {
          "result": 1,
          "cur_unit": "IDR(100)",
          "ttb": "8.73",
          "tts": "8.9",
          "deal_bas_r": "8.82",
          "bkpr": "8",
          "yy_efee_r": "0",
          "ten_dd_efee_r": "0",
          "kftc_bkpr": "8",
          "kftc_deal_bas_r": "8.82",
          "cur_nm": "인도네시아 루피아"
        },
        {
          "result": 1,
          "cur_unit": "JPY(100)",
          "ttb": "898.54",
          "tts": "916.69",
          "deal_bas_r": "907.62",
          "bkpr": "907",
          "yy_efee_r": "0",
          "ten_dd_efee_r": "0",
          "kftc_bkpr": "907",
          "kftc_deal_bas_r": "907.62",
          "cur_nm": "일본 옌"
        },
        {
          "result": 1,
          "cur_unit": "KRW",
          "ttb": "0",
          "tts": "0",
          "deal_bas_r": "1",
          "bkpr": "1",
          "yy_efee_r": "0",
          "ten_dd_efee_r": "0",
          "kftc_bkpr": "1",
          "kftc_deal_bas_r": "1",
          "cur_nm": "한국 원"
        },
        {
          "result": 1,
          "cur_unit": "KWD",
          "ttb": "4,501.89",
          "tts": "4,592.84",
          "deal_bas_r": "4,547.37",
          "bkpr": "4,547",
          "yy_efee_r": "0",
          "ten_dd_efee_r": "0",
          "kftc_bkpr": "4,547",
          "kftc_deal_bas_r": "4,547.37",
          "cur_nm": "쿠웨이트 디나르"
        },
        {
          "result": 1,
          "cur_unit": "MYR",
          "ttb": "310.35",
          "tts": "316.62",
          "deal_bas_r": "313.49",
          "bkpr": "313",
          "yy_efee_r": "0",
          "ten_dd_efee_r": "0",
          "kftc_bkpr": "313",
          "kftc_deal_bas_r": "313.49",
          "cur_nm": "말레이지아 링기트"
        },
        {
          "result": 1,
          "cur_unit": "NOK",
          "ttb": "125.89",
          "tts": "128.44",
          "deal_bas_r": "127.17",
          "bkpr": "127",
          "yy_efee_r": "0",
          "ten_dd_efee_r": "0",
          "kftc_bkpr": "127",
          "kftc_deal_bas_r": "127.17",
          "cur_nm": "노르웨이 크로네"
        },
        {
          "result": 1,
          "cur_unit": "NZD",
          "ttb": "812.41",
          "tts": "828.82",
          "deal_bas_r": "820.62",
          "bkpr": "820",
          "yy_efee_r": "0",
          "ten_dd_efee_r": "0",
          "kftc_bkpr": "820",
          "kftc_deal_bas_r": "820.62",
          "cur_nm": "뉴질랜드 달러"
        },
        {
          "result": 1,
          "cur_unit": "SAR",
          "ttb": "369.38",
          "tts": "376.85",
          "deal_bas_r": "373.12",
          "bkpr": "373",
          "yy_efee_r": "0",
          "ten_dd_efee_r": "0",
          "kftc_bkpr": "373",
          "kftc_deal_bas_r": "373.12",
          "cur_nm": "사우디 리얄"
        },
        {
          "result": 1,
          "cur_unit": "SEK",
          "ttb": "126.36",
          "tts": "128.91",
          "deal_bas_r": "127.64",
          "bkpr": "127",
          "yy_efee_r": "0",
          "ten_dd_efee_r": "0",
          "kftc_bkpr": "127",
          "kftc_deal_bas_r": "127.64",
          "cur_nm": "스웨덴 크로나"
        },
        {
          "result": 1,
          "cur_unit": "SGD",
          "ttb": "1,032.31",
          "tts": "1,053.16",
          "deal_bas_r": "1,042.74",
          "bkpr": "1,042",
          "yy_efee_r": "0",
          "ten_dd_efee_r": "0",
          "kftc_bkpr": "1,042",
          "kftc_deal_bas_r": "1,042.74",
          "cur_nm": "싱가포르 달러"
        },
        {
          "result": 1,
          "cur_unit": "THB",
          "ttb": "40.23",
          "tts": "41.04",
          "deal_bas_r": "40.64",
          "bkpr": "40",
          "yy_efee_r": "0",
          "ten_dd_efee_r": "0",
          "kftc_bkpr": "40",
          "kftc_deal_bas_r": "40.64",
          "cur_nm": "태국 바트"
        },
        {
          "result": 1,
          "cur_unit": "USD",
          "ttb": "1,386.49",
          "tts": "1,414.5",
          "deal_bas_r": "1,400.5",
          "bkpr": "1,400",
          "yy_efee_r": "0",
          "ten_dd_efee_r": "0",
          "kftc_bkpr": "1,400",
          "kftc_deal_bas_r": "1,400.5",
          "cur_nm": "미국 달러"
        }
      ]


    })
});

// 사용자 입력
const amount = ref(0);
const fromCurrency = ref('USD');
const toCurrency = ref('KRW');

// 환율 계산
const convertedAmount = computed(() => {
  if (amount.value <= 0) return null;

  // 출발 통화와 목표 통화에 해당하는 환율 찾기
  const fromRate = exchangeRates.value.find(rate => rate.cur_unit === fromCurrency.value);
  const toRate = exchangeRates.value.find(rate => rate.cur_unit === toCurrency.value);

  if (!fromRate || !toRate) return null;

  // 계산 (ttb: 출발 통화 -> 목표 통화의 매매 기준율)
  let fromRateValue = parseFloat(fromRate.ttb.replace(/,/g, ''));
  let toRateValue = parseFloat(toRate.tts.replace(/,/g, ''));

  // 값이 0일 경우 1로 변경
  if (fromRateValue === 0) fromRateValue = 1;
  if (toRateValue === 0) toRateValue = 1;

  const conversionRate = fromRateValue / toRateValue;

  return (amount.value * conversionRate).toFixed(2);
});
</script>

<style scoped>
.currency-converter {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

div {
  margin-bottom: 10px;
}

label {
  font-weight: bold;
}

input,
select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
