<template>
  <section id="latest-content">
    <b-container class="text-white">
      <b-row>
        <b-col lg="10">
          <h3 v-for="item in latestItems" :key="item.id" class="display-3">
            <b-link :to="item.link" v-html="item.title" />
          </h3>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
export default {
  name: 'Latest',
  props: {
    latestItems: {},
  },
};
</script>
