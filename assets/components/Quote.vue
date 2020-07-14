<template>
  <section class="container">
    <b-row>
      <b-col lg="8">
        <b-carousel
          id="carousel-quotes"
          class="carousel-text"
          :interval="4000"
          indicators
          @sliding-start="onSlideStart"
          @sliding-end="onSlideEnd"
        >
          <b-carousel-slide v-for="item in quotes" :key="item.id">
            <p v-html="item.body" />
            <small v-html="item.author" />
          </b-carousel-slide>
        </b-carousel>
      </b-col>
    </b-row>
  </section>
</template>

<script>
export default {
  name: 'Quote',
  props: {
    quotes: {},
  },
  methods: {
    onSlideStart(slide) {
      this.sliding = true;
    },
    onSlideEnd(slide) {
      this.sliding = false;
    },
  },
};
</script>
