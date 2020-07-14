<template>
  <div>
    <AppHeader class="iris-yonder">Dance Events</AppHeader>
    <client-only>
      <loading :active.sync="isLoading" color="#13B4D1" full-page="true" />
      <go-top />
    </client-only>
    <Intro>
      Find dance performances, master classes, workshops, conventions, and
      festivals, taking place near you. You can also add your post for free and
      reach thousands of potential audience members!
      <div class="actions">
        <b-link to="/list/event" class="btn btn-primarypink"
          >Post an Event</b-link
        >
      </div>
    </Intro>
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
                  class="mb-3"
                >
                  <span slot="noResult">Oops! No category found.</span>
                </multiselect>
                <multiselect
                  v-model="region"
                  :options="totalRegionList"
                  :multiple="false"
                  placeholder="Select a region"
                  track-by="value"
                  label="name"
                  class="mb-3"
                >
                  <span slot="noResult">Oops! No region found.</span>
                </multiselect>
                <multiselect
                  v-model="country"
                  :options="totalCountryList"
                  :multiple="true"
                  placeholder="Select a country"
                  track-by="name"
                  label="name"
                  class="mb-3"
                >
                  <span slot="noResult">Oops! No country found.</span>
                </multiselect>
                <b-form-datepicker
                  v-model="dateFrom"
                  class="mb-3"
                ></b-form-datepicker>
                <b-form-datepicker v-model="dateTo"></b-form-datepicker>
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
      pager: {},
      keyword: '',
      categories: [],
      totalCategoryList: [],
      region: {name: 'All Regions', value: 'All'},
      totalRegionList: [
        {name: 'All Regions', value: 'All'},
        {name: 'Eastern USA', value: 'eastern'},
        {name: 'Nationwide N.A.', value: 'nationwide'},
        {name: 'Western USA', value: 'western'},
      ],
      country: {name: 'United States'},
      totalCountryList: [{name: 'United States'}],
      dateFrom: '',
      dateTo: '',
      metaItems: {
        site: 'DancePlug',
        title: 'Dance Events | DancePlug',
        description:
          'Find dance performances, master classes, workshops, conventions, and festivals, taking place near you. Add your post for free and reach thousands.',
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
          await this.fetchEvents(page);
        }
        this.isLoading = false;
      },
    },
  },
  async mounted() {
    await this.fetchCategories();
  },
  methods: {
    async fetchEvents(page) {
      const kw = this.buildKeywordQuery(this.keyword);
      const cat = this.buildCategoriesQuery(this.categories);
      let requestUrl =
        '/api/v1/events?keywords=' + kw + cat + '&region=' + this.region.value;
      if (this.dateFrom.length > 0) {
        requestUrl += '&date[min]=' + this.dateFrom;
      }
      if (this.dateTo.length > 0) {
        requestUrl += '&date[max]=' + this.dateTo;
      }
      const index = page - 1;
      if (index > 0) requestUrl = requestUrl + '&page=' + index;
      await this.$axios
          .get(requestUrl, {
            headers: {'Access-Control-Allow-Origin': '*'},
          })
          .then(async (response) => {
            this.loadedNodes = [];
            response.data.rows.forEach((event) => {
              this.loadedNodes.push(event);
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
      this.region = {name: 'All Regions', value: 'All'};
      this.country = {name: 'United States'};
      this.dateFrom = '';
      this.dateTo = '';
      this.search();
    },
    async search() {
      console.log(this.dateFrom);
      this.isFilterHidden = !this.isFilterHidden;
      this.isLoading = true;
      const query = Object.assign({}, this.$route.query);
      if (query.page) {
        delete query.page;
        this.$router.replace({query});
      }
      await this.fetchEvents(1);
      this.isLoading = false;
    },
    async fetchCategories() {
      await this.$axios
          .get('/api/v1/events/tax', {
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
          href: 'https://www.danceplug.com/events',
        },
        {
          rel: 'prev',
          href:
            'https://www.danceplug.com/events' +
            (this.pager.currentPage == undefined || this.pager.currentPage == 1 ?
              '' :
              '?page=' + this.pager.currentPage - 1),
        },
        {
          rel: 'next',
          href:
            'https://www.danceplug.com/events?page=' +
            (this.pager.currentPage == undefined || this.pager.currentPage == 1 ?
              2 :
              this.pager.currentPage + 1),
        },
      ],
    };
  },
};
</script>
