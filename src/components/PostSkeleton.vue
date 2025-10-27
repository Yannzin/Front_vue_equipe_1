<template>
  <div class="skeleton-card" aria-hidden="true">
    <div class="skeleton-header"></div>
    <div class="skeleton-line-long"></div>
    <div class="skeleton-line-short"></div>
  </div>
</template>

<style scoped>

@keyframes pulse {
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
}

.skeleton-card {
  border: 1px solid #e0e0e0;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
}

.skeleton-header,
.skeleton-line-long,
.skeleton-line-short {
  height: 15px;
  margin-bottom: 10px;
  background: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%);
  background-size: 400px 100%;
  animation: pulse 1s infinite ease-out;
  border-radius: 4px;
}

.skeleton-header {
  height: 25px;
  width: 70%;
  margin-bottom: 20px;
}

.skeleton-line-long {
  width: 95%;
}

.skeleton-line-short {
  width: 60%;
}
</style>