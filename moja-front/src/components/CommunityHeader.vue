<template>
  <header class="header">
    <div class="logo">MOJA</div>
    <nav class="nav-links">
      <a href="#" class="nav-item">모자 랭킹</a>
      <a href="#" class="nav-item">공지사항</a>
      <div class="dropdown">
        <a href="#" class="nav-item">자유 게시판</a>
        <div class="dropdown-content">
          <a href="#">추천해요</a>
          <a href="#">이건 몰랐지?</a>
          <a href="#">질문 있어요</a>
        </div>
      </div>
      <a href="#" class="nav-item">모자 챌린지</a>
    </nav>
  </header>
</template>

<style scoped>
.header {
  background-color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #40a2e3;
}

.nav-links {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}

.nav-item {
  color: #333;
  text-decoration: none;
  font-weight: 500;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: white;
  min-width: 160px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.dropdown-content a {
  color: #333;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>
