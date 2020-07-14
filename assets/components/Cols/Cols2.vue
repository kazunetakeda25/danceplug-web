<template>
  <section class="row col2-ti" :class="color">
    <b-col md="6" class="mx-auto text-white">
      <slot name="text"></slot>
    </b-col>
    <b-col
      md="6"
      class="bg-image"
      :style="'background-image: url(' + image + ')'"
    />
  </section>
</template>

<script>
export default {
  name: 'Cols2',
  props: {
    color: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
};
</script>
