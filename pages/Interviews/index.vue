<template>
  <div>
    <client-only>
      <loading :active.sync="isLoading" color="#13B4D1" full-page="true" />
      <go-top />
    </client-only>
    <AppHeader class="iris-yonder">Dance Interviews</AppHeader>
    <Intro
      >Watch dance interviews with famous dancers, choreographers, and directors
      and go behind the scenes of TV shows such as Fox's So You Think You Can
      Dance.</Intro
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
      totalInterviewsCount: null,
      pager: {},
      keyword: '',
      categories: [],
      totaltotalCategoryList: [],
      metaItems: {
        site: 'DancePlug',
        title: 'Dance Interviews | DancePlug',
        description:
          'Watch dance interviews with famous dancers, choreographers, and directors and go behind the scenes of TV shows such as Fox\'s So You Think You Can Dance.',
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
          await this.fetchInterviews(page);
        }
        this.isLoading = false;
      },
    },
  },
  async mounted() {
    await this.fetchCategories();
  },
  methods: {
    async fetchInterviews(page) {
      const kw = this.buildKeywordQuery(this.keyword);
      const cat = this.buildCategoriesQuery(this.categories);
      let requestUrl = '/api/v1/interviews?keywords=' + kw + cat;
      const index = page - 1;
      if (index > 0) requestUrl = requestUrl + '&page=' + index;
      await this.$axios
          .get(requestUrl, {
            headers: {'Access-Control-Allow-Origin': '*'},
          })
          .then(async (response) => {
            this.loadedNodes = [];
            response.data.rows.forEach((interview) => {
              this.loadedNodes.push(interview);
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
      await this.fetchInterviews(1);
      this.isLoading = false;
    },
    async fetchCategories() {
      await this.$axios
          .get('/api/v1/interviews/tax', {
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
      link: [
        {
          rel: 'canonical',
          href: 'https://www.danceplug.com/interviews',
        },
        {
          rel: 'prev',
          href:
            'https://www.danceplug.com/interviews' +
            (this.pager.currentPage == undefined || this.pager.currentPage == 1 ?
              '' :
              '?page=' + this.pager.currentPage - 1),
        },
        {
          rel: 'next',
          href:
            'https://www.danceplug.com/interviews?page=' +
            (this.pager.currentPage == undefined || this.pager.currentPage == 1 ?
              2 :
              this.pager.currentPage + 1),
        },
      ],
    };
  },
};
</script>
