<template>
  <section class="container">
    <b-row>
      <b-col v-for="item in nodes" :key="item.id" md="6" lg="6" xl="4">
        <Card no-body class="cpreview">
          <MediaPreview
            :poster-image="item.poster"
            :source-video="item.video"
            :image="item.image"
          />
          <b-card-body v-if="item.title || item.author || item.description">
            <b-card-title v-if="item.title">
              <b-link :to="item.link" v-html="item.title" />
            </b-card-title>
            <div v-if="item.author || item.instructor" class="author">
              <span v-html="item.author" />
              <span v-html="item.instructor" />
            </div>
            <b-card-text v-if="item.summary" v-html="item.summary" />
          </b-card-body>
          <b-card-footer
            v-if="
              item.category ||
                item.readtime ||
                item.level ||
                item.style ||
                item.type
            "
          >
            <small class="tax">
              <span v-if="item.category" v-html="item.category" />
              <span v-if="item.level" v-html="item.level" />
              <span v-if="item.style" v-html="item.style" />
              <span v-if="item.type" v-html="item.type" />
            </small>
            <small v-if="item.readtime" class="read">
              <Icon name="icon-hourglass" size="sm" />
              <div v-html="item.readtime" />
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
import MediaPreview from '@/assets/components/Cards/MediaPreview';
export default {
  name: 'CardPreview',
  components: {
    MediaPreview,
  },
  props: {
    nodes: {
      type: Array,
      required: true,
    },
  },
};
</script>
