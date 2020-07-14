<template>
  <section id="features">
    <b-container>
      <h2 class="display-2">Features</h2>
      <b-row>
        <b-col
          v-for="item in features"
          :key="item.id"
          md="6"
          lg="4"
          class="mb-4"
        >
          <Icon :name="item.featIcon" color="primary" size="xl" />
          <h3>{{ item.featTitle }}</h3>
          <p>{{ item.featDesc }}</p>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
export default {
  name: 'Feature',
  props: {
    features: {
      type: Array,
      required: true,
    },
  },
};
</script>
