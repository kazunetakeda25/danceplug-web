<template>
  <div>
    <client-only>
      <loading :active.sync="isLoading" color="#13B4D1" full-page="true" />
      <go-top />
    </client-only>
    <div v-if="pageType == true">
      <AppHeader class="iris-yonder">{{ this.pageCategory }}</AppHeader>
      <Intro
        >Watch {{ this.pageCategory }}, and other dance videos selected just for
        you. Find old classics, inspiring performances, and the latest
        conceptual sensations. Enjoy then hit replay.</Intro
      >
      <section class="container card-list">
        <b-row align-h="end">
          <b-col md="6" lg="4" class="my-3">
            <div class="filter">
              <b-link
                class="filter-dropdown"
                @click="isFilterHidden = !isFilterHidden"
              >
                <Icon name="icon-filter" size="size" />Filter
              </b-link>
              <Card v-if="!isFilterHidden" no-body class="filter-card">
                <b-card-body>
                  <b-input
                    ref="keyword"
                    v-model="keyword"
                    placeholder="Enter some keywords"
                  />
                </b-card-body>
                <b-card-footer>
                  <b-button-group>
                    <b-button
                      variant="secondary btn-filter-reset"
                      @click="reset"
                      >Reset</b-button
                    >
                    <b-button
                      type="submit"
                      variant="primary btn-filter-search"
                      @click="search"
                      >Search</b-button
                    >
                  </b-button-group>
                </b-card-footer>
              </Card>
            </div>
          </b-col>
        </b-row>
      </section>
      <CardPreview :nodes="loadedNodes" />
      <div class="pager">
        <Paginator :pager="pager" />
      </div>
    </div>
    <div v-else-if="pageType == false">
      <AppHeader class="iris-yonder" :image="data.image" />
      <PageHolder
        class="hero-hide"
        :flag="data.flag"
        :title="data.title"
        :tax="data.category"
        :video2="data.video2"
        enable-sumo="false"
        no-header="false"
      >
        <div v-html="data.body" />
      </PageHolder>
    </div>
    <div v-else>
      <PageNotFound404 v-if="isLoading == false" />
    </div>
  </div>
</template>

<script>
import PageHolder from '@/assets/components/PageHolder';
import CardPreview from '@/assets/components/Cards/CardPreview';
const paginate = require('jw-paginate');
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

let VueScrollTo = false;
if (process.browser) {
  VueScrollTo = require('vue-scrollto');
}

export default {
  components: {
    PageHolder,
    CardPreview,
  },
  data() {
    return {
      data: {},
      loadedNodes: [],
      isLoading: false,
      pageType: null,
      isFilterHidden: true,
      pager: {},
      keyword: '',
      pageCategory: '',
      metaItems: {
        site: 'DancePlug',
        descriptionFront: 'Watch ',
        descriptionEnd:
          ', and other dance videos selected just for you. Find old classics, inspiring performances, and the latest conceptual sensations.',
        coverImage:
          'https://cdn.danceplug.com/sites/default/files/dplogo_og.png',
      },
    };
  },
  watch: {
    '$route.query.page': {
      immediate: true,
      async handler(page) {
        this.isLoading = true;
        if ((await this.isCategoryPage()) == true) {
          page = parseInt(page) || 1;
          if (page !== this.pager.currentPage) {
            await this.fetchVideos(page);
          }
        } else {
          await this.fetchVideoNode();
        }
        this.isLoading = false;
      },
    },
  },
  methods: {
    buildCategorySlug(content) {
      return content
          .replace(/ \u0026amp; /g, '-')
          .replace(/\//g, '-')
          .replace(/ /g, '-')
          .toLowerCase();
    },
    buildCategoryQuery(content) {
      return content.replace(/\//g, '+').replace('&', '%26');
    },
    buildKeywordQuery(content) {
      return content.replace(/\//g, '+').replace('&', '%26');
    },
    async isCategoryPage() {
      const response = await this.$axios.get('/api/v1/videos/tax', {
        headers: {'Access-Control-Allow-Origin': '*'},
      });
      const categoryData = response.data.filter(
          (item) =>
            this.buildCategorySlug(item.category) ===
          this.$route.params.videos.toLowerCase(),
      );
      if (categoryData.length > 0 && this.$route.params.category == undefined) {
        this.pageType = true;
        this.pageCategory = entities.decode(categoryData[0].category);
        return true;
      }
      return false;
    },
    async search() {
      this.isFilterHidden = !this.isFilterHidden;
      this.isLoading = true;
      const query = Object.assign({}, this.$route.query);
      if (query.page) {
        delete query.page;
        this.$router.replace({query});
      }
      await this.fetchVideos(1);
      this.isLoading = false;
    },
    reset() {
      this.keyword = '';
      this.search();
    },
    async fetchVideos(page) {
      const kw = this.buildKeywordQuery(this.keyword);
      const cat = this.buildCategoryQuery(this.pageCategory);
      let requestUrl = '/api/v1/videos?keywords=' + kw + '&category=' + cat;
      const index = page - 1;
      if (index > 0) requestUrl = requestUrl + '&page=' + index;
      await this.$axios
          .get(requestUrl, {
            headers: {'Access-Control-Allow-Origin': '*'},
          })
          .then((response) => {
            this.loadedNodes = [];
            response.data.rows.forEach((video) => {
              this.loadedNodes.push(video);
            });
            const pageInfo = response.data.pager;
            this.pager = paginate(
                pageInfo.total_items,
                pageInfo.current_page + 1,
                pageInfo.items_per_page,
                5,
            );
            if (process.browser) {
              VueScrollTo.scrollTo('.intro');
            }
          });
    },
    async fetchVideoNode() {
      const path = this.$route.path;
      await this.$axios
          .get('/api/v1/videos/all', {
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
                  .get('/api/v1/videos/' + nid, {
                    headers: {'Access-Control-Allow-Origin': '*'},
                  })
                  .then((pageResponse) => {
                    this.pageType = false;
                    this.data = pageResponse.data[0];
                  });
            }
          });
    },
  },
  metaInfo() {
    return {
      title:
        this.pageType == true ?
          this.pageCategory + ' - Dance Videos | ' + this.metaItems.site :
          this.pageType == false ?
          this.data.title + ' | ' + this.metaItems.site :
          this.metaItems.site,
      meta: [
        {
          property: 'og:title',
          content:
            this.pageType == true ?
              this.pageCategory + ' | Dance Videos' :
              this.pageType == false ?
              this.data.title + ' | Dance Video' :
              this.metaItems.site,
        },
        {
          property: 'og:url',
          content:
            this.pageType == true ?
              'https://www.danceplug.com/videos/' + this.$route.params.videos :
              'https://www.danceplug.com' + this.data.link,
        },
        {
          property: 'og:image',
          content:
            this.pageType == true ?
              this.metaItems.coverImage :
              this.data.seo_image,
        },
        {
          name: 'description',
          content:
            this.pageType == true ?
              this.metaItems.descriptionFront +
                this.pageCategory +
                this.metaItems.descriptionEnd :
              this.data.seo_description,
        },
        {
          property: 'og:description',
          content:
            this.pageType == true ?
              this.metaItems.descriptionFront +
                this.pageCategory +
                this.metaItems.descriptionEnd :
              this.data.seo_description,
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
            this.pageType == true ?
              this.pageCategory + ' - Dance Videos' :
              this.pageType == false ?
              this.data.title + ' | Dance Video' :
              this.metaItems.site,
        },
        {
          property: 'twitter:description',
          content:
            this.pageType == true ?
              this.metaItems.descriptionFront +
                this.pageCategory +
                this.metaItems.descriptionEnd :
              this.data.seo_description,
        },
        {
          property: 'twitter:url',
          content:
            this.pageType == true ?
              'https://www.danceplug.com/videos/' + this.$route.params.videos :
              'https://www.danceplug.com' + this.data.link,
        },
        {
          property: 'twitter:creator',
          content: '@danceplug',
        },
        {
          property: 'twitter:image',
          content:
            this.pageType == true ?
              this.metaItems.coverImage :
              this.data.seo_image,
        },
      ],
      link: [
        {
          rel: 'canonical',
          href:
            this.pageType == true ?
              'https://www.danceplug.com/videos/' + this.$route.params.videos :
              'https://www.danceplug.com' + this.data.link,
        },
        {
          rel: 'prev',
          href:
            this.pageType == true ?
              'https://www.danceplug.com/videos/' +
                this.$route.params.videos +
                (this.pager.currentPage == undefined ||
                this.pager.currentPage == 1 ?
                  '' :
                  '?page=' + (this.pager.currentPage - 1)) :
              'Not Available',
        },
        {
          rel: 'next',
          href:
            this.pageType == true ?
              'https://www.danceplug.com/videos/' +
                this.$route.params.videos +
                '?page=' +
                (this.pager.currentPage == undefined ||
                this.pager.currentPage == 1 ?
                  2 :
                  this.pager.currentPage + 1) :
              'Not Available',
        },
      ],
    };
  },
};
</script>
