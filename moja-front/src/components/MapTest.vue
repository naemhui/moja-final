<template>
    <div class="text-center d-flex flex-column justify-content-center align-items-center">
      <div class="d-flex justify-content-between">
        <div class="d-flex">
          <div class="me-3 input-group board-type-select">
            <span class="input-group-text" id="city">도시</span>
            <select class="form-select" name="city" id="city" v-model="cityInput">
              <option value="" disabled>시/도 선택</option>
              <option v-for="city in cityList" :value="city">{{ city }}</option>
            </select>
          </div>
      
          <div class="me-3 input-group board-type-select">
            <span class="input-group-text" id="area">지역</span>
            <select class="form-select" name="area" id="area" v-model="areaInput">
              <option value="" disabled>지역 선택</option>
              <option value="all" v-if="cityInput">전체</option>
              <option v-for="area in areaObj[cityInput]" :value="area">{{ area }}</option>
            </select>
          </div>
      
          <div class="me-3 input-group board-type-select">
            <span class="input-group-text" id="bank">은행</span>
            <select class="form-select" name="bank" id="bank" v-model="bankInput">
              <option value="" disabled>은행 선택</option>
              <option value="은행">전체</option>
              <option v-for="bank in bankList" :value="bank">{{ bank }}</option>
            </select>
          </div>
        </div>
        <button class="search-btn btn btn-success" @click="search">검색</button>
      </div>
      <div class="mt-5" ref="container" style="width:500px;height:400px;"></div>
    </div>
  
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useMapStore } from '@/stores/map'
  
  const store = useMapStore()
  const cityInput = ref(store.city)
  const areaInput = ref(store.area)
  const bankInput = ref('')
  
  const cityList = [
    "서울특별시",
    "인천광역시",
    "대전광역시",
    "광주광역시",
    "대구광역시",
    "울산광역시",
    "부산광역시",
    "경기도",
    "강원도",
    "충청북도",
    "충청남도",
    "전라북도",
    "전라남도",
    "경상북도",
    "경상남도",
    "제주도"
  ]
  
  const areaObj = {
      "서울특별시": ["강남구","강동구","강북구","강서구","관악구","광진구","구로구","금천구","노원구","도봉구","동대문구","동작구","마포구","서대문구","서초구","성동구","성북구","송파구","양천구","영등포구","용산구","은평구","종로구","중구","중랑구"],
      "인천광역시": ["계양구","남구","남동구","동구","부평구","서구","연수구","중구","강화군","옹진군"],
      "대전광역시": ["대덕구","동구","서구","유성구","중구"],
      "광주광역시": ["광산구","남구","동구", "북구","서구"],
      "대구광역시": ["남구","달서구","동구","북구","서구","수성구","중구","달성군"],
      "울산광역시": ["남구","동구","북구","중구","울주군"],
      "부산광역시": ["강서구","금정구","남구","동구","동래구","부산진구","북구","사상구","사하구","서구","수영구","연제구","영도구","중구","해운대구","기장군"],
      "경기도": ["고양시","과천시","광명시","광주시","구리시","군포시","김포시","남양주시","동두천시","부천시","성남시","수원시","시흥시","안산시","안성시","안양시","양주시","오산시","용인시","의왕시","의정부시","이천시","파주시","평택시","포천시","하남시","화성시","가평군","양평군","여주군","연천군"],
      "강원도": ["강릉시","동해시","삼척시","속초시","원주시","춘천시","태백시","고성군","양구군","양양군","영월군","인제군","정선군","철원군","평창군","홍천군","화천군","횡성군"],
      "충청북도": ["제천시","청주시","충주시","괴산군","단양군","보은군","영동군","옥천군","음성군","증평군","진천군","청원군"],
      "충청남도": ["계룡시","공주시","논산시","보령시","서산시","아산시","천안시","금산군","당진군","부여군","서천군","연기군","예산군","청양군","태안군","홍성군"],
      "전라북도": ["군산시","김제시","남원시","익산시","전주시","정읍시","고창군","무주군","부안군","순창군","완주군","임실군","장수군","진안군"],
      "전라남도": ["광양시","나주시","목포시","순천시","여수시","강진군","고흥군","곡성군","구례군","담양군","무안군","보성군","신안군","영광군","영암군","완도군","장성군","장흥군","진도군","함평군","해남군","화순군"],
      "경상북도": ["경산시","경주시","구미시","김천시","문경시","상주시","안동시","영주시","영천시","포항시","고령군","군위군","봉화군","성주군","영덕군","영양군","예천군","울릉군","울진군","의성군","청도군","청송군","칠곡군"],
      "경상남도": ["거제시","김해시","마산시","밀양시","사천시","양산시","진주시","진해시","창원시","통영시","거창군","고성군","남해군","산청군","의령군","창녕군","하동군","함안군","함양군","합천군"],
      "제주도": ["서귀포시","제주시","남제주군","북제주군"],
  }
  
  const bankList = [
    '경남은행',
    '국민은행',
    '광주은행',
    '기업은행',
    '농협',
    '대구은행',
    '부산은행',
    '산업은행',
    '새마을금고',
    '수협',
    '신한은행',
    '신협',
    '씨티은행',
    '우리은행',
    '전북은행',
    '제주은행',
    '하나은행',
    'sc제일은행',
  ]
  
  let map = null
  let infowindow = null
  let markerList = []
  const container = ref(null)
  
  const initMap = () => {
    let lat = 35.204210
    let lng = 126.807207
    
    if (cityInput.value && areaInput.value) {
      const geocoder = new kakao.maps.services.Geocoder()
      geocoder.addressSearch(`${cityInput.value} ${areaInput.value}`, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const options = {
            center: new kakao.maps.LatLng(result[0].y, result[0].x),
            level: 6
          }
          map = new kakao.maps.Map(container.value, options)
          const zoomControl = new kakao.maps.ZoomControl()
          map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT)
          infowindow = new kakao.maps.InfoWindow({zIndex:1})
          return
        }
      })
    } 
  
    const options = {
      center: new kakao.maps.LatLng(lat, lng),
      level: 3
    }
    map = new kakao.maps.Map(container.value, options)
    const zoomControl = new kakao.maps.ZoomControl()
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT)
    infowindow = new kakao.maps.InfoWindow({zIndex:1})
  }
  
  const loadScript = function() {
    const key = import.meta.env.VITE_KAKAO_API_KEY
    // const key = '4d5ec81213db24db98518aaf73cd18fe'
    const script = document.createElement('script')
    
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${key}&libraries=services`
    script.addEventListener('load', () => kakao.maps.load(initMap))
    document.head.appendChild(script)
  }
  
  function placesSearchCB (data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
  
          // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
          // LatLngBounds 객체에 좌표를 추가합니다
          var bounds = new kakao.maps.LatLngBounds()
  
          for (var i=0; i<data.length; i++) {
              const marker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(data[i].y, data[i].x) 
              })     
              const tag = '<div style="padding:5px;font-size:12px;">' + data[i].place_name + '</div>'
              bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x))
              kakao.maps.event.addListener(marker, 'click', function() {
                  // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
                  infowindow.setContent(tag)
                  infowindow.open(map, marker)
              })
              markerList.push(marker)
          }
  
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
          map.setBounds(bounds)
      } 
  }
  
  function resetMarker() {
    markerList.forEach((marker) => {
      marker.setMap(null)
    })
  
    markerList.length = 0
  }
  
  const search = function() {
    resetMarker()
    const ps = new kakao.maps.services.Places()
    if (!cityInput.value) {
      window.alert('시/도를 선택하세요.')
    } else if (!areaInput.value) {
      window.alert('지역을 선택하세요.')
    } else if (!bankInput.value) {
      window.alert('은행을 선택하세요')
    } else {
      let keyword = `${cityInput.value} ${areaInput.value} ${bankInput.value}`
      keyword = keyword.replace(' all', '')
      ps.keywordSearch(keyword, placesSearchCB)
    }
  }
  
  onMounted(() => {
    if (window.kakao?.maps) {
      console.log('맵 있음', window.kakao.maps)
      initMap()
    } else {
      console.log('load 필요')
      loadScript()
    }
  })
  
  </script>
  
  <style scoped>
  .search-btn {
    width: 75px;
  }
  </style>