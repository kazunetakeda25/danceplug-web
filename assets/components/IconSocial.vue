<template>
  <a
    data-placement="top"
    data-toggle="tooltip"
    :href="link"
    :title="title"
    target="_blank"
  >
    <Icon :name="name" :color="color" :size="size" />
    <span class="sr-only">{{ title }}</span>
  </a>
</template>

<script>
export default {
  name: 'IconSocial',
  props: {
    link: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    size: {
      type: String,
      required: false,
    },
    color: {
      type: String,
      required: false,
    },
  },
};
</script>
