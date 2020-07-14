<template>
  <div>
    <AppHeader class="iris-yonder">Dance Teachers</AppHeader>
    <client-only>
      <loading :active.sync="isLoading" color="#13B4D1" full-page="true" />
      <go-top />
    </client-only>
    <Intro>
      Learn to dance from the best dance teachers across a variety of styles for
      any skill level without traveling to Los Angeles, New York or across the
      globe.
      <div class="actions">
        <b-link to="/pricing" class="btn btn-primary">Get Started</b-link>
        <b-link to="/class/free" class="btn btn-ghost">Try a FREE class</b-link>
      </div>
    </Intro>
    <section class="container">
      <div class="row col-avatar">
        <ColsAvatar
          v-for="item in colsItems"
          :key="item.id"
          :title="item.title"
          :image="item.image"
          :styles="item.styles"
          :link="item.link"
        />
      </div>
    </section>
  </div>
</template>

<script>
import ColsAvatar from '@/assets/components/Cols/ColsAvatar';
const loadingDuration = 10;

export default {
  components: {
    ColsAvatar,
  },
  data() {
    return {
      colsItems: [],
      loadingDuration,
      isLoading: false,
      metaItems: {
        site: 'DancePlug',
        title: 'Dance Instructors | DancePlug',
        description:
          'Learn to dance from the best dance teachers across a variety of styles for any skill level without traveling to Los Angeles or New York. Sign up today!',
        coverImage:
          'https://cdn.danceplug.com/sites/default/files/dplogo_og.png',
      },
    };
  },
  async mounted() {
    this.isLoading = true;
    await this.$axios
        .get('/api/v1/instructors', {
          headers: {'Access-Control-Allow-Origin': '*'},
        })
        .then((response) => {
          this.colsItems = [];
          response.data.forEach((instructor) => {
            this.colsItems.push(instructor);
          });
        });
    this.isLoading = false;
  },
  metaInfo() {
    return {
      title: this.metaItems.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.metaItems.description,
        },
        {hid: 'og:title', name: 'og:title', content: this.metaItems.title},
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.metaItems.description,
        },
        {hid: 'og:url', name: 'og:url', content: this.pageUrl},
        {
          hid: 'og:image',
          name: 'og:image',
          content: this.metaItems.coverImage,
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.metaItems.title,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.metaItems.description,
        },
        {
          hide: 'twitter:card',
          name: 'twitter:card',
          content: this.metaItems.coverImage ? 'summary_large_image' : 'summary',
        },
        {hid: 'twitter:url', name: 'twitter:url', content: this.pageUrl},
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: this.metaItems.coverImage,
        },
      ].filter((x) => x.content),
      link: [
        {rel: 'canonical', href: 'https://www.danceplug.com/instructors'},
      ],
    };
  },
};
</script>
