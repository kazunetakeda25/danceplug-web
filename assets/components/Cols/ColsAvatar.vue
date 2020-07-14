<template>
  <b-col cols="6" md="4" lg="3">
    <b-link :to="link">
      <div
        v-if="image"
        class="cols-avatar picture-rounded-circle"
        v-html="image"
      />
      <h4 v-if="title" class="title">{{ title }}</h4>
    </b-link>
    <small v-if="styles" class="tax" v-html="styles" />
  </b-col>
</template>

<script>
export default {
  name: 'ColsAvatar',
  props: {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    styles: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loadingDuration: 10,
    };
  },
};
</script>
