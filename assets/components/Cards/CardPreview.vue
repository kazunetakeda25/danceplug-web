<template>
  <section class="container">
    <b-row>
      <b-col v-for="item in nodes" :key="item.id" md="6" lg="4">
        <Card no-body class="cpreview">
          <a :href="item.link" target="_self" v-html="item.image" />
          <b-card-body v-if="item.title || item.author || item.summary">
            <b-card-title v-if="item.title">
              <b-link :to="item.link" v-html="item.title" />
            </b-card-title>
            <div v-if="item.author" class="author" v-html="item.author" />
            <div v-if="item.location" class="location" v-html="item.location" />
            <b-card-text v-if="item.summary" v-html="item.summary" />
          </b-card-body>
          <b-card-footer v-if="item.category || item.readtime || item.date">
            <small v-if="item.category" class="tax" v-html="item.category" />
            <small v-if="item.readtime" class="read">
              <Icon name="icon-hourglass" size="sm" />
              {{ item.readtime }} min
            </small>
            <small v-if="item.date" class="read">
              <Icon name="icon-calendar-mark" size="sm" />
              {{ item.date }}
            </small>
          </b-card-footer>
        </Card>
      </b-col>
      <b-container v-if="nodes == undefined || nodes.length == 0">
        <p class="text-center">No Result Found.</p>
      </b-container>
    </b-row>
  </section>
</template>

<script>
export default {
  name: 'CardPreviewArticle',
  props: {
    nodes: {
      type: Array,
      required: true,
    },
  },
};
</script>
