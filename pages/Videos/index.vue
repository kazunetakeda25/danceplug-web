<template>
  <div>
    <AppHeader class="iris-yonder">Dance Videos</AppHeader>
    <client-only>
      <loading :active.sync="isLoading" color="#13B4D1" full-page="true" />
      <go-top />
    </client-only>
    <Intro
      >Watch our collection of dance videos selected just for you. Find old
      classics, inspiring performances, and the latest conceptual sensations.
      Enjoy then hit replay.</Intro
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
                  class="mb-3"
                />
                <multiselect
                  v-model="categories"
                  :options="totalCategoryList"
                  :multiple="true"
                  placeholder="Select a category"
                  track-by="category"
                  label="category"
                >
                  <span slot="noResult">Oops! No category found.</span>
                </multiselect>
              </b-card-body>
              <b-card-footer>
                <b-button-group>
                  <b-button variant="secondary btn-filter-reset" @click="reset"
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
</template>

<script>
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
    CardPreview,
  },
  data() {
    return {
      loadedNodes: [],
      isLoading: false,
      isFilterHidden: true,
      totalVideosCount: null,
      pager: {},
      keyword: '',
      categories: [],
      totaltotalCategoryList: [],
      metaItems: {
        site: 'DancePlug',
        title: 'Dance Videos | DancePlug',
        description:
          'Watch our collection of dance videos selected just for you. Find old classics, inspiring performances, and the latest conceptual sensations.',
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
        page = parseInt(page) || 1;
        if (page !== this.pager.currentPage) {
          await this.fetchVideos(page);
        }
        this.isLoading = false;
      },
    },
  },
  async mounted() {
    await this.fetchCategories();
  },
  methods: {
    async fetchVideos(page) {
      const kw = this.buildKeywordQuery(this.keyword);
      const cat = this.buildCategoriesQuery(this.categories);
      let requestUrl = '/api/v1/videos?keywords=' + kw + cat;
      const index = page - 1;
      if (index > 0) requestUrl = requestUrl + '&page=' + index;
      await this.$axios
          .get(requestUrl, {
            headers: {'Access-Control-Allow-Origin': '*'},
          })
          .then(async (response) => {
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
    reset() {
      this.keyword = '';
      this.categories = [];
      this.search();
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
    async fetchCategories() {
      await this.$axios
          .get('/api/v1/videos/tax', {
            headers: {'Access-Control-Allow-Origin': '*'},
          })
          .then((response) => {
            this.totalCategoryList = response.data;
            this.totalCategoryList.forEach((item) => {
              item.category = entities.decode(item.category);
            });
          });
    },
    buildKeywordQuery(content) {
      return content.replace(/\//g, '+').replace('&', '%26');
    },
    buildCategoriesQuery(contentArray) {
      let text = '';
      for (let i = 0; i < contentArray.length; i++) {
        let part = contentArray[i].category
            .replace(/\//g, '+')
            .replace('&', '%26');
        part = part + '+(' + contentArray[i].tid + ')';
        text = text + '&category=' + part;
      }
      return text;
    },
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
        {
          rel: 'canonical',
          href: 'https://www.danceplug.com/videos',
        },
        {
          rel: 'prev',
          href:
            'https://www.danceplug.com/videos' +
            (this.pager.currentPage == undefined || this.pager.currentPage == 1 ?
              '' :
              '?page=' + this.pager.currentPage - 1),
        },
        {
          rel: 'next',
          href:
            'https://www.danceplug.com/videos?page=' +
            (this.pager.currentPage == undefined || this.pager.currentPage == 1 ?
              2 :
              this.pager.currentPage + 1),
        },
      ],
    };
  },
};
</script>
