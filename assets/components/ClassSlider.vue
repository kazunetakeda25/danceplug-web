<template>
  <b-col md="6" lg="4" class="class-list">
    <div class="slider-col">
      <div class="slider">
        <ul class="list-unstyled">
          <li v-for="item in classSlides" :key="item.id">
            <b-link
              v-if="item.image"
              :to="item.link"
              class=""
              v-html="item.image"
            />
          </li>
        </ul>
      </div>
    </div>
  </b-col>
</template>

<script>
export default {
  name: 'ClassSlider',
  props: {
    classSlides: {},
  },
};
</script>
