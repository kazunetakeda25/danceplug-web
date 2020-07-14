<template>
  <section class="container intro">
    <b-row>
      <b-col lg="8">
        <p class="lead">
          <slot></slot>
        </p>
      </b-col>
    </b-row>
  </section>
</template>

<script>
export default {
  name: 'Intro',
};
</script>
