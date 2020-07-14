<template>
  <section class="container">
    <h1>404 Error</h1>
    <router-link to="/" exact>
      Go to home page
    </router-link>
  </section>
</template>

<script>
export default {
  props: ['payload'],
};
</script>
