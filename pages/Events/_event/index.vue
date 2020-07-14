<template>
  <div>
    <client-only>
      <loading :active.sync="isLoading" color="#13B4D1" full-page="true" />
      <go-top />
    </client-only>
    <div v-if="pageType == true">
      <AppHeader class="iris-yonder">{{ this.pageCategory }}</AppHeader>
      <Intro>
        Find dance performances, master classes, workshops, conventions, and
        festivals, taking place near you. You can also add your post for free
        and reach thousands of potential audience members!
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
      <AppHeader :image="data.image" />
      <PageHolder
        :flag="data.flag"
        :title="data.title"
        :credit="data.caption"
        :tax="data.category"
        enable-sumo="false"
        no-header="false"
      >
        <b-row class="top">
          <b-col lg="6">
            <div v-html="data.date" />
          </b-col>
          <b-col lg="6">
            <div v-html="data.location" />
          </b-col>
        </b-row>
        <div v-html="data.body" />
        <div v-if="data.tickets" class="bottom" v-html="data.tickets" />
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
        descriptionFront: 'Find ',
        descriptionEnd:
          ', dance performances, master classes, workshops, conventions, and festivals, taking place near you.',
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
            await this.fetchEvents(page);
          }
        } else {
          await this.fetchEventNode();
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
      const response = await this.$axios.get('/api/v1/events/tax', {
        headers: {'Access-Control-Allow-Origin': '*'},
      });
      const categoryData = response.data.filter(
          (item) =>
            this.buildCategorySlug(item.category) ===
          this.$route.params.event.toLowerCase(),
      );
      if (categoryData.length > 0) {
        this.pageType = true;
        this.pageCategory = entities.decode(categoryData[0].category);
        return true;
      }
      return false;
    },
    reset() {
      this.keyword = '';
      this.region = {name: 'All Regions', value: 'All'};
      this.country = {name: 'United States'};
      this.dateFrom = '';
      this.dateTo = '';
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
      await this.fetchEvents(1);
      this.isLoading = false;
    },
    async fetchEvents(page) {
      const kw = this.buildKeywordQuery(this.keyword);
      const cat = this.buildCategoryQuery(this.pageCategory);
      let requestUrl = '/api/v1/events?keywords=' + kw + '&category=' + cat;
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
          .then((response) => {
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
    async fetchEventNode() {
      const path = this.$route.path;
      await this.$axios
          .get('/api/v1/events/all', {
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
                  .get('/api/v1/events/' + nid, {
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
          this.pageCategory + ' | Dance Events | ' + this.metaItems.site :
          this.pageType == false ?
          this.data.title + ' | Dance Event' + this.metaItems.site :
          this.metaItems.site,
      meta: [
        {
          property: 'og:title',
          content:
            this.pageType == true ?
              this.pageCategory + ' | Dance Events' :
              this.pageType == false ?
              this.data.title + ' | Dance Event' :
              this.metaItems.site,
        },
        {
          property: 'og:url',
          content:
            this.pageType == true ?
              'https://www.danceplug.com/events/' + this.$route.params.event :
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
              this.pageCategory + ' | Dance Events' :
              this.pageType == false ?
              this.data.title + ' | Dance Event' :
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
              'https://www.danceplug.com/events/' + this.$route.params.event :
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
              'https://www.danceplug.com/events/' + this.$route.params.event :
              'https://www.danceplug.com' + this.data.link,
        },
        {
          rel: 'prev',
          href:
            this.pageType == true ?
              'https://www.danceplug.com/events/' +
                this.$route.params.event +
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
              'https://www.danceplug.com/events/' +
                this.$route.params.event +
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
