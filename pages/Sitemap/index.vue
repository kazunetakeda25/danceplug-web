<template>
  <div>
    <AppHeader class="iris-ruby">{{ content.title }}</AppHeader>
    <client-only>
      <loading :active.sync="isLoading" color="#13B4D1" full-page="true" />
      <go-top />
    </client-only>
    <PageHolder enable-sumo="false" no-header="false">
      <article v-html="content.body" />
    </PageHolder>
  </div>
</template>

<script>
import PageHolder from '@/assets/components/PageHolder';
export default {
  components: {
    PageHolder,
  },
  data() {
    return {
      content: {},
      isLoading: false,
      metaItems: {
        site: 'DancePlug',
        title: 'Sitemap | DancePlug',
        description: 'Discover everything you need to know about DancePlug.',
        coverImage:
          'https://cdn.danceplug.com/sites/default/files/dplogo_og.png',
      },
    };
  },
  metaInfo() {
    return {
      title: this.metaItems.title,
      meta: [
        {name: 'description', content: this.metaItems.description},
        {name: 'og:title', content: this.metaItems.title},
        {name: 'og:description', content: this.metaItems.description},
        {name: 'og:url', content: this.pageUrl},
        {name: 'og:image', content: this.metaItems.coverImage},
        {name: 'twitter:title', content: this.metaItems.title},
        {name: 'twitter:description', content: this.metaItems.description},
        {
          name: 'twitter:card',
          content: this.metaItems.coverImage ? 'summary_large_image' : 'summary',
        },
        {name: 'twitter:url', content: this.pageUrl},
        {name: 'twitter:image', content: this.metaItems.coverImage},
      ].filter((x) => x.content),
      link: [{rel: 'canonical', href: 'https://www.danceplug.com/sitemap'}],
    };
  },
  async mounted() {
    this.isLoading = true;
    await this.$axios
        .get('/api/v1/basic/25', {
          headers: {'Access-Control-Allow-Origin': '*'},
        })
        .then((response) => {
          console.log(response.data);
          this.content = response.data[0];
        });
    this.isLoading = false;
  },
};
</script>
