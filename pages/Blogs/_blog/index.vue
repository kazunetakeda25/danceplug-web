<template>
  <div>
    <client-only>
      <loading :active.sync="isLoading" color="#13B4D1" full-page="true" />
      <go-top />
    </client-only>
    <div v-if="pageType == false">
      <AppHeader :image="data.image" />
      <PageHolder
        :flag="data.flag"
        :title="data.title"
        :credit="data.caption"
        :tax="data.category"
        :date="data.date"
        enable-sumo="false"
        no-header="false"
      >
        <div v-html="data.body" />
      </PageHolder>
    </div>
    <div v-else-if="pageType == null">
      <PageNotFound404 v-if="isLoading == false && isPageLoaded == true" />
    </div>
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
      data: {},
      isLoading: false,
      isPageLoaded: false,
      pageType: null,
      metaItems: {
        site: 'DancePlug',
        title: 'Dance Blog | DancePlug',
        description: 'Keep up to date with all DancePlug\'s news.',
        coverImage:
          'https://cdn.danceplug.com/sites/default/files/dplogo_og.png',
      },
    };
  },
  async mounted() {
    this.isLoading = true;
    const path = this.$route.path;
    await this.$axios
        .get('/api/v1/blogs/all', {
          headers: {'Access-Control-Allow-Origin': '*'},
        })
        .then(async (response) => {
          const pageItem = response.data.filter((x) => x.link === path);
          if (
            pageItem != undefined &&
          pageItem.length > 0 &&
          pageItem[0].hasOwnProperty('nid')
          ) {
            const nid = pageItem[0].nid;
            await this.$axios
                .get('/api/v1/blogs/' + nid, {
                  headers: {'Access-Control-Allow-Origin': '*'},
                })
                .then((pageResponse) => {
                  this.pageType = false;
                  this.data = pageResponse.data[0];
                });
          }
        });
    this.isLoading = false;
    this.isPageLoaded = true;
  },
  metaInfo() {
    return {
      title:
        this.pageType == false ?
          this.data.title + ' | ' + this.metaItems.site :
          this.metaItems.site,
      meta: [
        {
          property: 'og:title',
          content:
            this.pageType == false ?
              this.data.title + ' | ' + this.metaItems.site :
              this.metaItems.site,
        },
        {
          property: 'og:url',
          content: 'https://www.danceplug.com' + this.data.link,
        },
        {
          property: 'og:image',
          content: this.data.seo_image,
        },
        {
          name: 'description',
          content: this.data.seo_description,
        },
        {
          property: 'og:description',
          content: this.data.seo_description,
        },
        {
          property: 'twitter:card',
          content: 'summary',
        },
        {
          property: 'twitter:site',
          content: this.metaItems.site,
        },
        {
          property: 'twitter:title',
          content:
            this.pageType == false ?
              this.data.title + ' | ' + this.metaItems.site :
              this.metaItems.site,
        },
        {
          property: 'twitter:description',
          content: this.data.seo_description,
        },
        {
          property: 'twitter:url',
          content: 'https://www.danceplug.com' + this.data.link,
        },
        {
          property: 'twitter:creator',
          content: '@danceplug',
        },
        {
          property: 'twitter:image',
          content: this.data.seo_image,
        },
      ],
      link: [
        {
          rel: 'canonical',
          href: 'https://www.danceplug.com' + this.data.link,
        },
      ],
    };
  },
};
</script>
