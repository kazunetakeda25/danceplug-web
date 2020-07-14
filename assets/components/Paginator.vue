<template>
  <ul v-if="pager.pages && pager.pages.length" class="pagination">
    <li
      :class="{ disabled: pager.currentPage === 1 }"
      class="page-item first-item"
    >
      <router-link
        :to="{ query: { page: 1 } }"
        class="page-link"
        draggable="false"
        >«</router-link
      >
    </li>
    <li
      :class="{ disabled: pager.currentPage === 1 }"
      class="page-item previous-item"
    >
      <router-link
        :to="{ query: { page: pager.currentPage - 1 } }"
        class="page-link"
        draggable="false"
        >‹</router-link
      >
    </li>
    <li
      v-for="page in pager.pages"
      :key="page"
      :class="{ active: pager.currentPage === page }"
      class="page-item number-item"
    >
      <router-link
        :to="{ query: { page: page } }"
        class="page-link"
        draggable="false"
        >{{ page }}</router-link
      >
    </li>
    <li
      :class="{ disabled: pager.currentPage === pager.totalPages }"
      class="page-item next-item"
    >
      <router-link
        :to="{ query: { page: pager.currentPage + 1 } }"
        class="page-link"
        draggable="false"
        >›</router-link
      >
    </li>
    <li
      :class="{ disabled: pager.currentPage === pager.totalPages }"
      class="page-item last-item"
    >
      <router-link
        :to="{ query: { page: pager.totalPages } }"
        class="page-link"
        draggable="false"
        >»</router-link
      >
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Paginator',
  props: ['pager'],
  watch: {
    pager() {},
  },
};
</script>

<style scoped>
.pagination li a {
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-content: center;
}
</style>
