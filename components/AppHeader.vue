<template>
  <header id="page-header" :class="image ? 'h-image' : 'iris-ruby'">
    <div v-if="image" v-parallax="-0.2" class="hero">
      <div class="hero-image" v-html="image" />
      <div class="row">
        <div class="col-sm-12 my-auto">
          <b-container>
            <slot name="home-welcome" />
          </b-container>
        </div>
      </div>
    </div>
    <div v-else class="hero">
      <div class="row h-100">
        <div class="col-sm-12 my-auto">
          <b-container>
            <h1 class="display-1">
              <slot />
            </h1>
          </b-container>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    image: {
      type: String,
      required: false,
    },
  },
};
</script>
