<!-- accounts/MyProfile.vue -->
<template>
  <div class="my-page-container">
    <div class="profile-section">
      <!-- 프로필 이미지 -->
      <div class="profile-image-section">
        <div class="profile-image-container">
          <img src="/cap-image.png" alt="모자" class="cap-image" />
          <img
            :src="previewImage || profileImage || '/default-profile.png'"
            alt="프로필 이미지"
            class="profile-image"
          />

          <!-- 이미지 업로드 버튼-->
          <div class="image-upload-controls" v-if="isEditing">
            <label for="profile-upload" class="upload-button">
              <span>이미지 변경</span>
              <input
                type="file"
                id="profile-upload"
                accept="image/*"
                @change="handleImageChange"
                class="hidden-input"
                ref="fileInput"
              />
            </label>
            <div v-if="previewImage" class="mt-2">
              <button @click="cancelImageUpload" class="cancel-upload-button">
                취소
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="profile-header">
        <h1>회원 정보</h1>
        <div>
          <button v-if="!isEditing" @click="deleteUser" class="delete-button me-3">
            회원 탈퇴
          </button>
          <button v-if="!isEditing" @click="toggleEdit" class="edit-button">
            정보 수정
          </button>
        </div>
      </div>

      <!-- 정보 표시 모드 -->
      <div v-if="!isEditing" class="user-info">
        <div class="info-grid">
          <div class="info-item">
            <label>아이디</label>
            <span>{{ userInfo.username }}</span>
          </div>
          <div class="info-item">
            <label>이메일</label>
            <span>{{ userInfo.email }}</span>
          </div>
          <div class="info-item">
            <label>닉네임</label>
            <span>{{ userInfo.nickname }}</span>
          </div>
          <div class="info-item">
            <label>생년월일</label>
            <span>{{ formatDate(userInfo.birth_date) }}</span>
          </div>
          <div class="info-item">
            <label>월 소득액</label>
            <span>{{ formatCurrency(userInfo.user_monthly_income) }}원</span>
          </div>
          <div class="info-item">
            <label>월 지출액</label>
            <span>{{ formatCurrency(userInfo.user_monthly_expenses) }}원</span>
          </div>
          <div class="info-item">
            <label>주거래은행</label>
            <span>{{ userInfo.bank?.bank_name || "미등록" }}</span>
          </div>
        </div>
      </div>

      <!-- 정보 수정 모드 -->
      <div v-else class="edit-form">
        <form @submit.prevent="handleSubmit">
          <div class="form-grid">
            <div class="form-item">
              <label>아이디</label>
              <div class="readonly-value">{{ userInfo.username }}</div>
            </div>
            <div class="form-item">
              <label>이메일</label>
              <input v-model="editForm.email" type="email" required />
            </div>
            <div class="form-item">
              <label>닉네임</label>
              <input v-model="editForm.nickname" type="nickname" required />
            </div>
            <div class="form-item">
              <label>생년월일</label>
              <div class="readonly-value">
                {{ formatDate(userInfo.birth_date) }}
              </div>
            </div>
            <div class="form-item">
              <label
                >월 소득액:
                <strong
                  >{{ formatCurrency(editForm.user_monthly_income) }}원</strong
                ></label
              >
              <input
                type="range"
                v-model="editForm.user_monthly_income"
                min="0"
                max="10000000"
                step="100000"
                class="slider"
              />
            </div>
            <div class="form-item">
              <label
                >월 지출액:
                <strong
                  >{{
                    formatCurrency(editForm.user_monthly_expenses)
                  }}원</strong
                ></label
              >
              <input
                type="range"
                v-model="editForm.user_monthly_expenses"
                min="0"
                max="10000000"
                step="100000"
                class="slider"
              />
            </div>
            <div class="form-item">
              <label>주거래은행</label>
              <select v-model="editForm.bank">
                <option v-for="bank in banks" :key="bank.id" :value="bank.id">
                  {{ bank.bank_name }}
                </option>
              </select>
            </div>
          </div>

          <div class="button-group">
            <button type="submit" class="save-button">저장</button>
            <button type="button" @click="toggleEdit" class="cancel-button">
              취소
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="my-products-section">
      <h2 class="section-title">나의 상품</h2>

      <!-- 상품이 없을 경우 -->
      <div v-if="!hasProducts" class="no-products">
        <p>등록된 상품이 없습니다.</p>
      </div>

      <!-- 상품 리스트 -->
      <div v-else class="products-grid">
        <div v-for="item in userProducts" :key="item.id" class="product-card">
          <!-- item.id를 key로 사용 -->
          <div v-if="item.product" class="card mb-4 shadow-sm">
            <!-- item.product가 있는지 확인 -->
            <div class="card-body">
              <div class="product-header">
                <div class="bank-info">
                  <img
                    :src="`/src/assets/images/banks/${
                      item.product.bank?.bank_name || 'default'
                    }.png`"
                    :alt="item.product.bank?.bank_name"
                    class="bank-logo"
                    @error="handleImageError"
                  />
                  <div class="bank-details">
                    <h5 class="product-name">{{ item.product.prdt_name }}</h5>
                    <small class="text-muted">{{
                      item.product.bank?.bank_name
                    }}</small>
                  </div>
                </div>
              </div>

              <hr />

              <div class="product-details">
                <div class="rate-info">
                  <p>
                    <span class="label">최고 금리:</span>
                    <span class="value"
                      >{{ getHighestRate(item.product.product_options) }}%</span
                    >
                  </p>
                  <p v-if="item.product.product_options?.length">
                    <span class="label">가입기간:</span>
                    <span class="value">
                      {{ item.product.product_options[0].save_trm }}개월 ~
                      {{
                        item.product.product_options[
                          item.product.product_options.length - 1
                        ].save_trm
                      }}개월
                    </span>
                  </p>
                </div>

                <div class="max-limit">
                  <p>
                    <span class="label">최대 가입금액:</span>
                    <span class="value">
                      {{
                        item.product.max_limit === null
                          ? "제한 없음"
                          : formatMaxLimit(item.product.max_limit)
                      }}
                    </span>
                  </p>
                </div>
              </div>

              <div class="button-group">
                <button
                  class="btn btn-danger"
                  @click="deleteUserProduct(item.product.id)"
                >
                  상품 삭제
                </button>
                <router-link
                  :to="{
                    name: 'productDetail',
                    params: { id: item.product.id },
                  }"
                  class="btn btn-primary"
                >
                  상세 보기
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 금리 비교 섹션 -->
      <div v-if="hasProducts">
        <!-- 섹션 1 -->
        <div v-if="!showNewChart" class="rate-comparison-section">
          <div class="section-header">
            <h2 class="section-title">금리 비교</h2>
            <button @click="toggleChartView" class="chart-toggle-button">
              금리 비교하기
            </button>
          </div>
          <div class="rates-container">
            <div
              v-for="item in userProducts"
              :key="item.id"
              class="rate-item"
              @click="showProductDetail(item.product.id)"
              role="button"
              tabindex="0"
            >
              <!-- 기존 내용 유지 -->
              <div class="rate-header">
                <span class="product-title">{{ item.product.prdt_name }}</span>
                <span class="bank-name">{{
                  item.product.bank?.bank_name
                }}</span>
              </div>
              <div class="rate-bars">
                <!-- 기존 막대 차트 내용 -->
                <div class="bar-container">
                  <div
                    class="rate-bar highest"
                    :style="{
                      height: `${
                        getHighestRate(item.product.product_options) * 20
                      }px`,
                    }"
                  >
                    <span class="rate-value"
                      >{{ getHighestRate(item.product.product_options) }}%</span
                    >
                  </div>
                  <div
                    class="rate-bar lowest"
                    :style="{
                      height: `${
                        getLowestRate(item.product.product_options) * 20
                      }px`,
                    }"
                  >
                    <span class="rate-value"
                      >{{ getLowestRate(item.product.product_options) }}%</span
                    >
                  </div>
                </div>
              </div>
              <div class="rate-legend">
                <span class="highest">최고금리</span>
                <span class="lowest">최저금리</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 섹션 2 -->
        <div v-else class="rate-comparison-section-new">
          <div class="section-header">
            <h2 class="section-title">금리 비교</h2>
            <button @click="toggleChartView" class="chart-toggle-button">
              상품 별 금리 보기
            </button>
          </div>
          <div class="rates-container-new">
            <div class="bar-container-new">
              <div class="rate-axis-new">
                <!-- 8%부터 0%까지 내림차순으로 변경 -->
                <div
                  class="rate-label-new"
                  v-for="value in [8, 6, 4, 2, 0]"
                  :key="value"
                >

                  <div class="rate-label-text">{{ value }}%</div>
                  <div class="rate-grid-line"></div>
                </div>
              </div>
              <div class="rate-bars-new">
                <div
                  v-for="item in userProducts"
                  :key="item.id"
                  class="rate-bar-wrapper-new"
                >
                  <div class="rate-bar-group-new">
                    <div
                      class="rate-bar-new highest-new"
                      :style="{
                        height: `${
                          (getHighestRate(item.product.product_options) / 8) *
                          90
                        }%`,
                      }"
                    >
                      <span class="rate-value-new">
                        {{ getHighestRate(item.product.product_options) }}%
                      </span>
                    </div>
                    <div
                      class="rate-bar-new lowest-new"
                      :style="{
                        height: `${
                          (getLowestRate(item.product.product_options) / 8) * 90
                        }%`,
                      }"
                    >
                      <span class="rate-value-new">
                        {{ getLowestRate(item.product.product_options) }}%
                      </span>
                    </div>
                  </div>
                  <div class="rate-label-wrapper-new">
                    <span class="product-title-new">{{
                      item.product.prdt_name
                    }}</span>
                    <span class="bank-name-new">{{
                      item.product.bank?.bank_name
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="rate-legend-new">
              <div class="legend-item-new">
                <div class="legend-color highest-new"></div>
                <span>최고금리</span>
              </div>
              <div class="legend-item-new">
                <div class="legend-color lowest-new"></div>
                <span>최저금리</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 모달 -->
      <Teleport to="body">
        <div v-if="isModalOpen" class="modal-backdrop" @click="closeModal">
          <div class="modal-container" @click.stop>
            <div class="modal-header">
              <h3>상품 상세 정보</h3>
              <button @click="closeModal" class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
              <ProductDetailView :id="$route.params.id" />
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useAccountStore } from "@/stores/account";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import ProductDetailView from "@/views/finances/ProductDetailView.vue";
import Swal from 'sweetalert2';

const accountStore = useAccountStore();
const isEditing = ref(false);
const userInfo = ref({});
const userProducts = ref([]);
const route = useRoute();
const router = useRouter();
const selectedProductId = ref(null);
const isModalOpen = ref(false);
const isFromRateChart = ref(false);
// 현재 URL을 저장할 변수 추가
const previousRoute = ref(null);

const showNewChart = ref(false);

const deleteUser = function () {
  axios({
    url: `${accountStore.BASE_URL}/detail/${accountStore.userId}/`,
    method: 'DELETE'
  })
  .then((res) => {
    accountStore.token = ''
    accountStore.userId = ''
    Swal.fire({
        title: '탈퇴 성공',
        text: '😪 아쉽지만 안녕히 가세요... 😪',
        icon: 'success', // success, error, warning, info
        confirmButtonText: '확인',
        customClass: {
          confirmButton: 'custom-success-button', // 버튼에 커스텀 클래스 추가
        },
      });

      router.push('/')
  })
}

const toggleChartView = () => {
  showNewChart.value = !showNewChart.value;

  // 다음 틱에서 애니메이션 실행
  nextTick(() => {
    // 모든 막대 선택
    const bars = document.querySelectorAll(".rate-bar, .rate-bar-new");

    // 초기 높이 0으로 설정
    bars.forEach((bar) => bar.classList.add("initial-height"));

    // 약간의 지연 후 실제 높이로 변경
    setTimeout(() => {
      bars.forEach((bar) => bar.classList.remove("initial-height"));
    }, 50);
  });
};

// 상품 금리 데이터 생성
const productRates = computed(() => {
  return userProducts.value.map((item) => ({
    highest: getHighestRate(item.product.product_options),
    lowest: getLowestRate(item.product.product_options),
  }));
});

const showProductDetail = async (productId) => {
  // 현재 URL 저장
  previousRoute.value = router.currentRoute.value.fullPath;

  // URL 변경 (실제 네비게이션은 prevent)
  router
    .push({
      name: "productDetail",
      params: { id: productId },
    })
    .catch(() => {}); // Navigation prevented 에러 무시

  // 모달 열기
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  // 이전 URL로 복귀
  if (previousRoute.value) {
    router.push(previousRoute.value);
  }
};

// 라우트 변경 감시
watch(
  () => route.name,
  (newRouteName) => {
    // productDetail 라우트로 직접 접근할 때는 모달 닫기
    if (newRouteName === "productDetail" && !isModalOpen.value) {
      isModalOpen.value = false;
    }
  }
);

// userInfo 변경 감시
watch(
  userInfo,
  (newValue) => {
    if (newValue && newValue.bank) {
      console.log("userInfo 변경 감지: " + newValue.bank.id);
      editForm.value.bank = newValue.bank.id;
      console.log("editForm 업데이트: " + editForm.value.bank);
    }
  },
  { deep: true }
);

// 최저 금리 계산 함수 추가
const getLowestRate = (options) => {
  if (!options || !options.length) return 0;
  return Math.min(...options.map((opt) => opt.max_intr_rate)).toFixed(2);
};

const banks = ref([
  {
    id: 1,
    bank_nick: "우리",
    bank_name: "우리은행",
  },
  {
    id: 2,
    bank_nick: "SC",
    bank_name: "한국스탠다드차타드은행",
  },
  {
    id: 3,
    bank_nick: "아이엠",
    bank_name: "아이엠뱅크",
  },
  {
    id: 4,
    bank_nick: "부산",
    bank_name: "부산은행",
  },
  {
    id: 5,
    bank_nick: "광주",
    bank_name: "광주은행",
  },
  {
    id: 6,
    bank_nick: "제주",
    bank_name: "제주은행",
  },
  {
    id: 7,
    bank_nick: "전북",
    bank_name: "전북은행",
  },
  {
    id: 8,
    bank_nick: "경남",
    bank_name: "경남은행",
  },
  {
    id: 9,
    bank_nick: "IBK",
    bank_name: "중소기업은행",
  },
  {
    id: 10,
    bank_nick: "KDB",
    bank_name: "한국산업은행",
  },
  {
    id: 11,
    bank_nick: "국민",
    bank_name: "국민은행",
  },
  {
    id: 12,
    bank_nick: "신한",
    bank_name: "신한은행",
  },
  {
    id: 13,
    bank_nick: "농협",
    bank_name: "농협은행주식회사",
  },
  {
    id: 14,
    bank_nick: "하나",
    bank_name: "하나은행",
  },
  {
    id: 15,
    bank_nick: "케이",
    bank_name: "주식회사 케이뱅크",
  },
  {
    id: 16,
    bank_nick: "수협",
    bank_name: "수협은행",
  },
  {
    id: 17,
    bank_nick: "카카오",
    bank_name: "주식회사 카카오뱅크",
  },
  {
    id: 18,
    bank_nick: "토스",
    bank_name: "토스뱅크 주식회사",
  }
]);

const editForm = ref({
  nickname: "",
  email: "",
  birth_date: "",
  user_monthly_income: 0,
  user_monthly_expenses: 0,
  bank: null,
});

// 사용자 정보 불러오기
const fetchUserInfo = async () => {
  try {
    const response = await axios({
      method: "get",
      url: `${accountStore.BASE_URL}/detail/${accountStore.userId}`,
      headers: {
        Authorization: `Token ${accountStore.token}`,
      },
    });
    console.log("서버 응답 데이터:", response.data);

    userInfo.value = {
      userId: response.data.pk,
      username: response.data.username,
      email: response.data.email,
      nickname: response.data.nickname,
      birth_date: response.data.birth_date,
      user_monthly_income: parseInt(response.data.user_monthly_income) || 0,
      user_monthly_expenses: parseInt(response.data.user_monthly_expenses) || 0,
      bank: response.data.bank,
    };

    // 프로필 이미지 URL 설정
    if (response.data.profile_image) {
      // BASE_URL에서 'accounts'를 제거하고 미디어 URL 구성
      const baseUrl = accountStore.BASE_URL.replace("/accounts", "");
      profileImage.value = `${response.data.profile_image}`;
      console.log("프로필 이미지 URL:", profileImage.value);
    } else {
      profileImage.value = "/default-profile.png";
    }

    initEditForm();
  } catch (error) {
    console.error("사용자 정보 로드 실패:", error);
  }
};

// 수정 폼 초기화 - 수정 가능한 필드만 포함
const initEditForm = () => {
  editForm.value = {
    nickname: userInfo.value.nickname || "",
    email: userInfo.value.email || "",
    user_monthly_income: parseInt(userInfo.value.user_monthly_income) || 0,
    user_monthly_expenses: parseInt(userInfo.value.user_monthly_expenses) || 0,
    bank: userInfo.value.bank,
  };
};

const toggleEdit = () => {
  if (isEditing.value) {
    initEditForm();
  }
  isEditing.value = !isEditing.value;
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("ko-KR");
};

const formatCurrency = (amount) => {
  const num = parseInt(amount) || 0;
  return new Intl.NumberFormat("ko-KR").format(num);
};


const handleSubmit = async () => {
  try {
    const formData = new FormData();

    // 기존 폼 데이터 추가
    Object.keys(editForm.value).forEach((key) => {
      if (editForm.value[key] !== null) {
        formData.append(key, editForm.value[key]);
      }
    });

    // 이미지 파일이 있으면 추가
    if (imageFile.value) {
      formData.append("profile_image", imageFile.value);
      console.log("이미지 파일 폼데이터에 추가됨:", imageFile.value.name);
    }

    const response = await axios({
      method: "put",
      url: `${accountStore.BASE_URL}/profile/update/`,
      headers: {
        Authorization: `Token ${accountStore.token}`,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });

    console.log("서버 응답:", response.data);

    if (response.data.profile_image) {
      // 전체 URL이 아닌 경우 BASE_URL과 결합
      profileImage.value = response.data.profile_image.startsWith("http")
        ? response.data.profile_image
        : `${accountStore.BASE_URL}${response.data.profile_image}`;
    }

    await fetchUserInfo();
    isEditing.value = false;
    imageFile.value = null;
    previewImage.value = null;
    Swal.fire({
      title: '회원 정보 수정',
      text: '회원 정보가 수정되었습니다',
      icon: 'success',
      timer: 1500,
      customClass: {
        popup: 'custom-popup',
        confirmButton: 'custom-success-button'
      }
    });
  } catch (error) {
    console.error("회원 정보 수정 실패:", error);
    console.error("에러 상세:", error.response?.data);
    Swal.fire({
      title: '회원 정보 수정 실패',
      text: '회원 정보 수정에 실패했습니다.',
      icon: 'error',
      timer: 1500,
      customClass: {
        popup: 'custom-popup',
        confirmButton: 'custom-warning-button'
      }
    });
  }
};

// 기본 프로필 이미지 경로
const profileImage = ref("/default-profile.png");
const previewImage = ref(null);
const imageFile = ref(null);
const fileInput = ref(null);

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // 파일 크기 체크 (예: 5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
      title: '파일 크기 확인',
      text: '파일 크기는 5MB를 초과할 수 없습니다.',
      icon: 'error',
      timer: 1500,
      customClass: {
        popup: 'custom-popup',
        confirmButton: 'custom-warning-button'
      }
    });
      event.target.value = ""; // 파일 선택 초기화
      return;
    }

    // 이미지 파일 타입 체크
    if (!file.type.startsWith("image/")) {
      Swal.fire({
      title: '파일 확인',
      text: '이미지 파일만 업로드 가능합니다.',
      icon: 'error',
      timer: 1500,
      customClass: {
        popup: 'custom-popup',
        confirmButton: 'custom-warning-button'
      }
    });
      event.target.value = "";
      return;
    }

    imageFile.value = file;
    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
    console.log("이미지 선택됨:", file.name);
  }
};

// 이미지 업로드 취소
const cancelImageUpload = () => {
  imageFile.value = null;
  previewImage.value = null;
  if (fileInput.value) {
    fileInput.value.value = ""; // 파일 입력 초기화
  }
};

// 상품 관련 함수들
const getHighestRate = (options) => {
  if (!options || !options.length) return 0;
  return Math.max(...options.map((opt) => opt.max_intr_rate)).toFixed(2);
};

const formatMaxLimit = (maxLimit) => {
  if (maxLimit === null) return "제한 없음";
  if (maxLimit >= 100000000) {
    return `${Math.floor(maxLimit / 100000000)}억 ${Math.floor(
      (maxLimit % 100000000) / 10000
    )}만원`;
  } else if (maxLimit >= 10000) {
    return `${Math.floor(maxLimit / 10000)}만원`;
  }
  return `${maxLimit}원`;
};

const fetchUserProducts = async () => {
  try {
    const response = await axios.get(
      "http://3.37.135.52/finances/user-product/",
      {
        params: { user_id: accountStore.userId },
      }
    );
    console.log("받은 상품 데이터:", response.data); // 데이터 확인용 로그
    userProducts.value = response.data;
  } catch (error) {
    console.error("상품 정보 로드 실패:", error);
    userProducts.value = []; // 에러 시 빈 배열로 초기화
  }
};

const deleteUserProduct = async (productId) => {
  try {
    await axios.delete("http://3.37.135.52/finances/user-product/", {
      data: { product_id: productId, user_id: accountStore.userId },
    });
    // 상품 목록 갱신
    await fetchUserProducts();
    Swal.fire({
      title: '삭제 성공',
      text: '상품 삭제를 성공했습니다.',
      icon: 'success',
      timer: 1500,
      customClass: {
        popup: 'custom-popup',
        confirmButton: 'custom-success-button'
      }
    });
  } catch (error) {
    console.error("상품 삭제 실패:", error);
    Swal.fire({
      title: '삭제 실패',
      text: '상품 삭제에 실패했습니다',
      icon: 'error',
      timer: 1500,
      customClass: {
        popup: 'custom-popup',
        confirmButton: 'custom-warning-button'
      }
    });
  }
};

// 상품 데이터 디버깅용 computed 속성 추가
const hasProducts = computed(() => {
  console.log("현재 상품 목록:", userProducts.value);
  return userProducts.value && userProducts.value.length > 0;
});

onMounted(async () => {
  console.log("마운트 시작");

  await fetchUserInfo();
  console.log("fetchUserInfo 완료 후: ", userInfo.value);

  await fetchUserProducts();
  console.log("fetchUserProducts 완료 후");

  if (userInfo.value && userInfo.value.bank) {
    console.log("userInfo에서 가져온 시점: " + userInfo.value.bank.id); // bank.id로 접근
    editForm.value.bank = userInfo.value.bank.id; // bank.id로 접근
    console.log("editForm에서 가져온 시점: " + editForm.value.bank);
  } else {
    console.log("userInfo가 비어있거나 undefined입니다");
  }
});
</script>

<style scoped>
.readonly-value {
  padding: 0.5rem;
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  color: #666;
}

.slider {
  width: 100%;
  margin-top: 0.5rem;
  cursor: pointer;
}

.form-item strong {
  color: #1890ff;
  margin-left: 0.5rem;
}

.my-page-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-section {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.delete-button {
  background-color: #e34040;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #c73232; /* hover 시 더 어두운 빨간색 */
}

.edit-button {
  background-color: #40a2e3;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.edit-button:hover {
  background-color: #358ac5; /* hover 시 더 어두운 파란색 */
}

.info-grid,
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  font-weight: 500;
  color: #666;
}

.info-item span {
  font-size: 1.1rem;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-item input,
.form-item select {
  padding: 0.5rem;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 1rem;
}

.save-button,
.cancel-button {
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.save-button {
  background-color: #40a2e3;
  color: white;
  border: none;
}

.cancel-button {
  background-color: white;
  border: 1px solid #d9d9d9;
}

.save-button:hover {
  background-color: #40a2e3;
}

.cancel-button:hover {
  background-color: #f5f5f5;
}

/* 프로필 이미지 */
.profile-image-section {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  position: relative;
}

.profile-image-container {
  position: relative;
  width: 200px;
  height: 200px;
}

.image-upload-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  padding: 8px;
  text-align: center;
  border-bottom-left-radius: 100px;
  border-bottom-right-radius: 100px;
  transition: opacity 0.3s;
}

.upload-button {
  color: white;
  padding: 6px 12px;
  cursor: pointer;
  display: inline-block;
  font-size: 0.9rem;
}

.upload-button:hover {
  text-decoration: underline;
}

.hidden-input {
  display: none;
}

.profile-image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #40a2e3;
}

.cap-image {
  position: absolute;
  top: -70px;
  left: 50%;
  transform: translateX(-50%);
  width: 160px;
  height: auto;
  z-index: 2;
}

.cancel-upload-button {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  margin-top: 4px;
}

.cancel-upload-button:hover {
  background-color: #ff3333;
}

/* 나의 상품 섹션 스타일 */
.my-products-section {
  margin-top: 2rem;
  width: 100%;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
}

.no-products {
  text-align: center;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.bank-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.bank-logo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.bank-details {
  flex-grow: 1;
}

.product-name {
  margin: 0;
  font-size: 1.1rem;
}

.product-details {
  margin-top: 1rem;
}

.label {
  color: #666;
  margin-right: 0.5rem;
}

.value {
  font-weight: 500;
  color: #333;
}

.button-group {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.button-group .btn {
  flex: 1;
}

.rate-comparison-section {
  margin-top: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.rates-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
}

.rate-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.rate-header {
  text-align: center;
  margin-bottom: 1rem;
}

.product-title {
  display: block;
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.bank-name {
  display: block;
  font-size: 0.9rem;
  color: #666;
}

.rate-bars {
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 1rem 0;
}

.bar-container {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.rate-bar {
  width: 40px;
  position: relative;
  border-radius: 4px 4px 0 0;
  transition: height 0.8s ease-out; /* 상승 애니메이션 */
}

.rate-bar.highest {
  background-color: #40a2e3;
}

.rate-bar.lowest {
  background-color: #93c6e7;
}

.rate-value {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  white-space: nowrap;
}

.rate-legend {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  font-size: 0.8rem;
}

.rate-legend .highest {
  color: #40a2e3;
}

.rate-legend .lowest {
  color: #93c6e7;
}


.rate-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 1001;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.modal-body {
  position: relative;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
}

.close-button:hover {
  color: #666;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.rate-comparison-section-new {
  margin-top: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.rate-bar-group-new {
  position: relative;
  display: flex;
  gap: 20px;
  height: 100%;
  align-items: flex-end; /* 하단 정렬 */
}

.rate-bars-new {
  display: flex;
  gap: 40px;
  margin-left: 60px;
  height: calc(100% - 40px); /* 상단 여백을 제외한 높이 */
  align-items: flex-end; /* 하단 정렬 */
  z-index: 3;
}

.rate-bar-wrapper-new {
  position: relative;
  height: 100%;
  width: 120px;
}

.rates-container-new {
  position: relative;
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 1rem;
  overflow: hidden;
}

.bar-container-new {
  height: 300px;
  position: relative;
  display: flex;
  padding: 20px 0;
  overflow-x: auto;
  white-space: nowrap;
}

.rate-axis-new {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  margin-right: 20px;
  position: sticky;
  left: 0;
  padding-bottom: 20px;
  min-width: 50px; /* Y축의 최소 너비 설정 */
  z-index: 2;
  background-color: white;
}

.rate-bar-new {
  width: 40px;
  position: absolute;
  bottom: 0; /* 하단에서 시작하도록 설정 */
  transition: height 0.8s ease-out; /* 상승 애니메이션 */
  border-radius: 4px 4px 0 0;
}
.rate-bar-wrapper-new {
  position: relative;
  height: 100%;
  width: 120px;
  margin: 0 20px;
}

.rate-bar-new.highest-new {
  background-color: #40a2e3;
}

.rate-bar-new.lowest-new {
  background-color: #93c6e7;
}

.rate-label-wrapper-new {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  padding: 0 10px;
}

.rate-value-new {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  white-space: nowrap;
}

.rate-label-new {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 40px;
  font-size: 0.8rem;
  color: #666;
  width: 100%;
  z-index: 10;
}

.rate-label-text {
  position: absolute;
  right: 10px;
  z-index: 10;
}

.rate-grid-line {
  position: absolute;
  left: 0; 
  width: 1500px; /* 충분히 긴 고정 너비 */
  height: 1px;
  background-color: #eee;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

.rate-bar-new {
  width: 40px;
  position: relative;
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease;
}

.rate-legend-new {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.legend-item-new {
  display: flex;
  align-items: center;
  margin: 0 10px;
}

.legend-color {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  border-radius: 50%;
}

.legend-color.highest-new {
  background-color: #40a2e3;
}

.legend-color.lowest-new {
  background-color: #93c6e7;
}

.product-title-new {
  font-weight: bold;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.bank-name-new {
  font-size: 0.8rem;
  color: #666;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.chart-toggle-button {
  padding: 0.5rem 1rem;
  background-color: #40a2e3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.chart-toggle-button:hover {
  background-color: #2d8bc7;
}

/* 초기 높이 클래스 */
.initial-height {
  height: 0 !important;
}

.bar-container-new::-webkit-scrollbar {
  height: 8px;
}

.bar-container-new::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.bar-container-new::-webkit-scrollbar-thumb {
  background: #2d8bc7;
  border-radius: 4px;
}

.bar-container-new::-webkit-scrollbar-thumb:hover {
  background: #2d8bc7;
}
</style>
