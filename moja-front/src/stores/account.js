import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {useRouter} from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2';


export const useAccountStore = defineStore('counter', () => {
  const router = useRouter()
  const token = ref('')
  const userId = ref(0)
  const isAdmin = ref(false)
  const BASE_URL = 'http://3.37.135.52/accounts'
  const isSuccess = ref(false)
  const birthDate = ref('')

  const getUserId = function(token) {
    axios({
      url: `${BASE_URL}/dj-rest-auth/user/`,
      method: 'get',
      headers: { 'Authorization': `Token ${token}` }
    })
    .then(res => {
      userId.value = res.data.pk
      getAdmin()
    })
    .catch(err => {
      console.log('pk 불러오기 실패');
    })
  }
  
  const getAdmin = function() {
    axios({
      url: `${BASE_URL}/detail/${userId.value}`,
      method: 'get',
    })
    .then(res => {
      console.log(isAdmin.value);
      isAdmin.value = res.data.is_superuser
      birthDate.value = res.data.birth_date
      console.log(isAdmin.value);
      console.log(birthDate.value);
    })
  }

  const login = function(loginData) {
    axios({
        url: `${BASE_URL}/dj-rest-auth/login/`,
        method: 'post',
        data: {
          username: loginData.userId,
          password: loginData.password
      }
    })
    .then((res) => {
      token.value = res.data.key;
      getUserId(token.value)
      isSuccess.value = !isSuccess.value
      Swal.fire({
        title: '로그인 성공',
        text: '😀 저희 서비스를 즐겨보세요 😀',
        icon: 'success', // success, error, warning, info
        confirmButtonText: '확인',
        timer: 1500,
        customClass: {
          confirmButton: 'custom-success-button', // 버튼에 커스텀 클래스 추가
        },
      });
      console.log(isSuccess.value);
    })
    .catch((err) => {
      Swal.fire({
        title: '로그인 실패',
        text: '😖 아이디 비밀번호를 다시 확인해주세요 😖',
        icon: 'error', // success, error, warning, info
        confirmButtonText: '확인',
        timer: 1500,
        customClass: {
          confirmButton: 'custom-warning-button', // 버튼에 커스텀 클래스 추가
        },
      });
      isSuccess.value = true; // 로그인 실패 시 false
    });
  }

  const logout = function() {
    // 로컬에서 토큰 삭제
    token.value = '';
    userId.value = 0;

    // 서버에 로그아웃 요청 (선택 사항, JWT는 클라이언트에서 관리하므로 실제로 필요하지 않지만)
    axios.post(`${BASE_URL}/dj-rest-auth/logout/`)
      .then((res) => {
        console.log('로그아웃 성공');
        // 로그아웃 후 처리 (예: 로그인 페이지로 리디렉션)
      })
      .catch((err) => {
        console.log('로그아웃 오류:', err);
      });

    // 로그아웃 후 필요한 추가 작업 (예: 로그인 페이지로 이동)
    // 예시: this.$router.push('/login');
  };

  return {login, BASE_URL, token, logout, isSuccess, userId, isAdmin, birthDate}
}, { persist: true })
