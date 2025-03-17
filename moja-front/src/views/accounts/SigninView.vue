<!-- accounts/SigninView.vue -->
<template>
  <div class="signup-container">
    <h1 class="title">회원가입</h1>
    <form @submit.prevent="signin" class="signup-form">
      <!-- 아이디 -->
      <div class="form-group">
        <label>아이디</label>
        <input type="text" v-model="username" placeholder="아이디를 입력하세요" required />
        <small v-if="usernameError" class="text-danger">{{ usernameError }}</small>
      </div>

      <!-- 비밀번호 -->
      <div class="form-group">
        <label>비밀번호</label>
        <input
          type="password"
          v-model="password1"
          placeholder="영문, 숫자, 특수문자를 혼합하여 8자리 이상 입력해주세요."
          required
        />
        <small v-if="passwordError" class="text-danger">{{ passwordError }}</small>
      </div>

      <!-- 비밀번호 확인 -->
      <div class="form-group">
        <label>비밀번호 확인</label>
        <input type="password" v-model="password2" placeholder="비밀번호를 다시 입력하세요" required />
        <small v-if="passwordMatchError" class="text-danger">{{ passwordMatchError }}</small>
      </div>

      <!-- 이메일 -->
      <div class="form-group">
        <label>이메일</label>
        <input type="email" v-model="email" placeholder="example@gmail.com" required />
        <small v-if="emailError" class="text-danger">{{ emailError }}</small>
      </div>

      <!-- 닉네임 -->
      <div class="form-group">
        <label>닉네임</label>
        <input type="text" v-model="nickname" placeholder="부적절한 닉네임은 사용할 수 없습니다" required />
        <small v-if="nicknameError" class="text-danger">{{ nicknameError }}</small>
      </div>

      <!-- 생년월일 -->
      <div class="form-group">
        <label>생년월일</label>
        <input type="date" v-model="birthdate" required />
      </div>

      <!-- 월 소득액 -->
      <div class="form-group">
        <label>월 소득액: <strong>{{ monthlyIncome }}원</strong></label>
        <input type="range" v-model="monthlyIncome" min="0" max="10000000" step="100000" class="slider" />
      </div>

      <!-- 월 지출액 -->
      <div class="form-group">
        <label>월 지출액: <strong>{{ monthlyExpenses }}원</strong></label>
        <input type="range" v-model="monthlyExpenses" min="0" max="10000000" step="100000" class="slider" />
      </div>

      <!-- 은행 선택 -->
      <div class="bank-filter form-group">
        <label>은행 선택</label>
        <div class="bank-slider">
          <div
            class="bank-item"
            v-for="bank in banks"
            :key="bank.id"
            :class="{ active: selectedBank === bank.id }"
            @click="selectBank(bank.id)"
          >
            <img :src="`/src/assets/images/banks/${bank.bank_name}.png`" alt="logo" class="bank-logo" />
            <div class="bank-name">{{ bank.bank_nick }}</div>
          </div>
        </div>
        <small v-if="selectedBank" class="text-success">선택된 은행: {{ selectedBankName }}</small>
      </div>

      <!-- 회원가입 버튼 -->
      <button type="submit" class="submit-button">회원가입</button>
    </form>
  </div>
</template>



<script setup>
import { ref, computed, onMounted } from "vue";
import { useAccountStore } from "@/stores/account";
import { useRouter } from "vue-router";
import axios from "axios";
import Swal from 'sweetalert2';

const store = useAccountStore();
const router = useRouter();

const username = ref("");
const password1 = ref("");
const password2 = ref("");
const email = ref("");
const nickname = ref("");
const birthdate = ref("");
const monthlyIncome = ref(2000000);
const monthlyExpenses = ref(100000);
const selectedBank = ref(null);

const banks = ref([
  
  {
    "id": 1,
    "bank_nick": "우리",
    "bank_name": "우리은행",
    "bank_code": "0010001",
    "bank_url": "https://spot.wooribank.com/pot/Dream?withyou=po"
  },
  {
    "id": 2,
    "bank_nick": "SC",
    "bank_name": "한국스탠다드차타드은행",
    "bank_code": "0010002",
    "bank_url": "http://www.standardchartered.co.kr"
  },
  {
    "id": 3,
    "bank_nick": "아이엠",
    "bank_name": "아이엠뱅크",
    "bank_code": "0010016",
    "bank_url": "http://www.imbank.co.kr"
  },
  {
    "id": 4,
    "bank_nick": "부산",
    "bank_name": "부산은행",
    "bank_code": "0010017",
    "bank_url": "http://www.busanbank.co.kr"
  },
  {
    "id": 5,
    "bank_nick": "광주",
    "bank_name": "광주은행",
    "bank_code": "0010019",
    "bank_url": "http://www.kjbank.com"
  },
  {
    "id": 6,
    "bank_nick": "제주",
    "bank_name": "제주은행",
    "bank_code": "0010020",
    "bank_url": "https://www.jejubank.com"
  },
  {
    "id": 7,
    "bank_nick": "전북",
    "bank_name": "전북은행",
    "bank_code": "0010022",
    "bank_url": "https://www.jbbank.co.kr/EFINANCE_MAIN.act"
  },
  {
    "id": 8,
    "bank_nick": "경남",
    "bank_name": "경남은행",
    "bank_code": "0010024",
    "bank_url": "https://www.knbank.co.kr/ib20/mnu/FPMDPT020000000"
  },
  {
    "id": 9,
    "bank_nick": "IBK",
    "bank_name": "중소기업은행",
    "bank_code": "0010026",
    "bank_url": "http://www.ibk.co.kr"
  },
  {
    "id": 10,
    "bank_nick": "KDB",
    "bank_name": "한국산업은행",
    "bank_code": "0010030",
    "bank_url": "https://www.kdb.co.kr"
  },
  {
    "id": 11,
    "bank_nick": "국민",
    "bank_name": "국민은행",
    "bank_code": "0010927",
    "bank_url": "http://www.kbstar.com"
  },

  {
    "id": 12,
    "bank_nick": "신한",
    "bank_name": "신한은행",
  },
  {
    "id": 13,
    "bank_nick": "농협",
    "bank_name": "농협은행주식회사",
  },
  {
    "id": 14,
    "bank_nick": "하나",
    "bank_name": "하나은행",
  },
  {
    "id": 15,
    "bank_nick": "케이",
    "bank_name": "주식회사 케이뱅크",
  },
  {
    "id": 16,
    "bank_nick": "수협",
    "bank_name": "수협은행",
  },
  {
    "id": 17,
    "bank_nick": "카카오",
    "bank_name": "주식회사 카카오뱅크",
  },
  {
    "id": 18,
    "bank_nick": "토스",
    "bank_name": "토스뱅크 주식회사",
    "bank_code": "0017801",
    "bank_url": "https://www.tossbank.com/product-service/savings/account"
  }
]);
  
const usernameError = computed(() => {
  if (!username.value) return "아이디를 입력해주세요.";
  if (username.value.length < 8 || !/^[a-zA-Z0-9]+$/.test(username.value)) {
    return "아이디는 8자리 이상, 영문과 숫자를 조합해주세요.";
  }
  return "";
});

const passwordError = computed(() => {
  if (!password1.value) return "비밀번호를 입력해주세요.";
  if (
    password1.value.length < 8 || 
    !/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d])[a-zA-Z\d\W]{8,}$/.test(password1.value)
  ) {
    return "비밀번호는 영문, 숫자, 특수문자를 포함하여 8자리 이상이어야 합니다.";
  }
  return "";
});


const passwordMatchError = computed(() => {
  if (!password2.value) return "비밀번호 확인을 입력해주세요.";
  if (password1.value !== password2.value) return "비밀번호가 일치하지 않습니다.";
  return "";
});

const emailError = computed(() => {
  if (!email.value) return "이메일을 입력해주세요.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    return "유효한 이메일 주소를 입력해주세요.";
  }
  return "";
});

const nicknameError = computed(() => {
  const prohibitedNicknames = ["admin", "관리자", "운영자"];
  if (!nickname.value) return "닉네임을 입력해주세요.";
  if (prohibitedNicknames.includes(nickname.value.toLowerCase())) {
    return "부적절한 닉네임은 사용할 수 없습니다.";
  }
  return "";
});

// 선택된 은행 이름 계산
const selectedBankName = computed(() => {
  const bank = banks.value.find((b) => b.id === selectedBank.value);
  return bank ? bank.bank_nick : "";
});

// 은행 선택
const selectBank = (bankId) => {
  selectedBank.value = bankId;
};

// 회원가입 처리
const signin = () => {
  if (
    usernameError.value ||
    passwordError.value ||
    passwordMatchError.value ||
    emailError.value ||
    nicknameError.value
  ) {
    Swal.fire({
        title: '회원가입 실패',
        text: '😋 아직 입력하지 않은게 있는거같아요! 😋',
        icon: 'error', // success, error, warning, info
        confirmButtonText: '확인',
        customClass: {
          confirmButton: 'custom-warning-button', // 버튼에 커스텀 클래스 추가
        },
      });
    return;
  }

  const signinData = {
    username: username.value,
    password1: password1.value,
    password2: password2.value,
    email: email.value,
    nickname: nickname.value,
    birth_date: birthdate.value,
    user_monthly_income: monthlyIncome.value,
    user_monthly_expenses: monthlyExpenses.value,
    bank: selectedBank.value,
  };
  console.log(password1);
  console.log(password2);
  
  axios
    .post("http://3.37.135.52/accounts/dj-rest-auth/registration", signinData)
    .then((res) => {
      Swal.fire({
        title: '회원가입 성공',
        text: '😀 저희 서비스를 즐기러 떠나볼까요? 😀',
        icon: 'success', // success, error, warning, info
        confirmButtonText: '확인',
        customClass: {
          confirmButton: 'custom-success-button', // 버튼에 커스텀 클래스 추가
        },
      });

      router.push('/')
    })
    .catch((err) => {
      Swal.fire({
        title: '회원가입 실패',
        text: '😅 입력값을 한번 더 확인해주세요! 😅',
        icon: 'error', // success, error, warning, info
        confirmButtonText: '확인',
        customClass: {
          confirmButton: 'custom-warning-button', // 버튼에 커스텀 클래스 추가
        },
      });
    });
};
</script>


<style scoped>
.bank-slider {
  display: flex;
  gap: 15px; /* 항목 간 간격 */
  overflow-x: auto; /* 가로 스크롤 활성화 */
  padding: 10px 0;
  scroll-behavior: smooth; /* 스크롤 애니메이션 추가 */
  scrollbar-width: thin; /* 스크롤바 너비 설정 (모던 브라우저) */
}

.bank-slider::-webkit-scrollbar {
  height: 6px; /* 스크롤바 높이 설정 (크롬, 사파리) */
}

.bank-slider::-webkit-scrollbar-thumb {
  background: #ddd; /* 스크롤바 색상 */
  border-radius: 10px;
}

.bank-item {
  flex: 0 0 auto; /* 아이템 크기를 고정 */
  text-align: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.bank-item.active {
  background-color: white;
  border: 2px solid #40A2E3;
  color: black;
  transform: scale(1.1); /* 선택된 항목 확대 */
}

.bank-logo {
  width: 50px;
  height: 50px;
  margin-bottom: 5px;
}

.bank-name {
  font-size: 14px;
  color: #333;
  font-weight: bold;
}

.text-success {
  color: green;
  font-size: 0.9em;
}

.signup-container {
  max-width: 1200px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center; /* 수평 가운데 정렬 */
}

.title {
  text-align: center;
  font-size: 28px;
  color: #333;
  margin-bottom: 30px;
  font-weight: bold;
}

.signup-form {
  display: flex;
  flex-direction: column;
  align-items: center; /* 수평 가운데 정렬 */
  width: 100%; /* 폼을 부모 너비에 맞춤 */
}

.form-group {
  width: 100%; /* 입력 필드가 부모 너비를 채우도록 설정 */
  max-width: 500px; /* 입력 필드 최대 너비 제한 */
  margin-bottom: 25px;
  text-align: left; /* 라벨 및 입력 필드 왼쪽 정렬 */
}

.form-group label {
  display: block;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #444;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f9f9f9;
  transition: border 0.3s ease;
}

.form-group input:focus {
  border-color: #007bff;
  outline: none;
  background-color: #fff;
}

.slider {
  width: 100%;
  margin-top: 15px;
}

.submit-button {
  padding: 15px;
  font-size: 18px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.3s ease;
  max-width: 500px; /* 버튼 너비를 제한 */
}

.submit-button:hover {
  background-color: #0056b3;
}
</style>
