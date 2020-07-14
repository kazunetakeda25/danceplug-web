<template>
  <div>
    <client-only>
      <loading :active.sync="isLoading" color="#13B4D1" full-page="true" />
      <go-top />
    </client-only>
    <div v-if="pageType == true">
      <AppHeader class="iris-yonder">{{ this.pageCategory }}</AppHeader>
      <Intro
        >Watch {{ this.pageCategory }} dance interviews with famous dancers,
        choreographers, and directors and go behind the scenes of TV shows such
        as Fox's So You Think You Can Dance.</Intro
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
          ', dance interviews with famous dancers, choreographers, and directors and go behind the scenes of TV shows such as Fox\'s So You Think You Can Dance.',
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
            await this.fetchInterviews(page);
          }
        } else {
          await this.fetchInterviewNode();
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
      const response = await this.$axios.get('/api/v1/interviews/tax', {
        headers: {'Access-Control-Allow-Origin': '*'},
      });
      const categoryData = response.data.filter(
          (item) =>
            this.buildCategorySlug(item.category) ===
          this.$route.params.interview.toLowerCase(),
      );
      if (categoryData.length > 0 && this.$route.params.category == undefined) {
        this.pageType = true;
        this.pageCategory = entities.decode(categoryData[0].category);
        return true;
      }
      return false;
    },
    reset() {
      this.keyword = '';
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
    async fetchInterviews(page) {
      const kw = this.buildKeywordQuery(this.keyword);
      const cat = this.buildCategoryQuery(this.pageCategory);
      let requestUrl = '/api/v1/interviews?keywords=' + kw + '&category=' + cat;
      const index = page - 1;
      if (index > 0) requestUrl = requestUrl + '&page=' + index;
      await this.$axios
          .get(requestUrl, {
            headers: {'Access-Control-Allow-Origin': '*'},
          })
          .then((response) => {
            this.$axios;
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
    async fetchInterviewNode() {
      const path = this.$route.path;
      await this.$axios
          .get('/api/v1/interviews/all', {
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
                  .get('/api/v1/interviews/' + nid, {
                    headers: {'Access-Control-Allow-Origin': '*'},
                  })
                  .then((pageResponse) => {
                    this.data = pageResponse.data[0];
                    this.pageType = false;
                  });
            }
          });
    },
  },
  metaInfo() {
    return {
      title:
        this.pageType == true ?
          this.pageCategory + ' | Dance Interviews | ' + this.metaItems.site :
          this.pageType == false ?
          this.data.title + ' | Dance Interview' + this.metaItems.site :
          this.metaItems.site,
      meta: [
        {
          property: 'og:title',
          content:
            this.pageType == true ?
              this.pageCategory + ' | Dance Interviews' :
              this.pageType == false ?
              this.data.title + ' | Dance Interview' :
              this.metaItems.site,
        },
        {
          property: 'og:url',
          content:
            this.pageType == true ?
              'https://www.danceplug.com/interviews/' +
                this.$route.params.interview :
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
              this.pageCategory + ' | Dance Interviews ' :
              this.pageType == false ?
              this.data.title + ' | Dance Interview' :
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
              'https://www.danceplug.com/interviews/' +
                this.$route.params.interview :
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
              'https://www.danceplug.com/interviews/' +
                this.$route.params.interview :
              'https://www.danceplug.com' + this.data.link,
        },
        {
          rel: 'prev',
          href:
            this.pageType == true ?
              'https://www.danceplug.com/interviews/' +
                this.$route.params.interview +
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
              'https://www.danceplug.com/interviews/' +
                this.$route.params.interview +
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
