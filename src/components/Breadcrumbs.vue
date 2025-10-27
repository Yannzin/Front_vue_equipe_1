<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const breadcrumbs = computed(() => {
  const crumbs = [];
  
  
  route.matched.forEach((match, index) => {
    
    const breadcrumbLabel = match.meta.breadcrumb;
    const isDynamic = typeof breadcrumbLabel === 'function';

    if (breadcrumbLabel) {
      crumbs.push({
        path: match.path,
        
        label: isDynamic ? breadcrumbLabel(route) : breadcrumbLabel,
        
        isLink: index < route.matched.length - 1, 
      });
    }
  });
  return crumbs;
});
</script>

<template>
  <nav aria-label="Breadcrumb de navegação" class="breadcrumbs">
    <ol class="breadcrumbs-list">
      <li v-for="(crumb, index) in breadcrumbs" :key="crumb.path" class="breadcrumb-item">
        <template v-if="crumb.isLink">
          <router-link :to="crumb.path" class="breadcrumb-link">{{ crumb.label }}</router-link>
        </template>
        <span v-else class="breadcrumb-current">{{ crumb.label }}</span>
        
        <span v-if="index < breadcrumbs.length - 1" class="breadcrumb-separator" aria-hidden="true">/</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumbs {
  padding: 10px 0;
  margin-bottom: 20px;
  font-size: 0.9em;
}
.breadcrumbs-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
}
.breadcrumb-item {
  display: flex;
  align-items: center;
}
.breadcrumb-link {
  color: #007bff; 
  text-decoration: none;
}
.breadcrumb-link:hover {
  text-decoration: underline;
}
.breadcrumb-current {
  color: #6c757d;
  font-weight: bold;
}
.breadcrumb-separator {
  margin: 0 8px;
  color: #ccc;
}
</style>