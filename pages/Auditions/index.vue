<template>
  <div>
    <AppHeader class="ruby-plum"
      >Dance Auditions, Jobs & Castings Calls</AppHeader
    >
    <client-only>
      <loading :active.sync="isLoading" color="#13B4D1" full-page="true" />
      <go-top />
    </client-only>
    <Intro
      >Find the latest dance auditions, casting calls and job openings across
      the world, including the United States, Canada, Europe and Australia.
      <div class="actions">
        <b-link to="/list/audition" class="btn btn-primarypink"
          >Post an Audition</b-link
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
                  v-model="talentTypes"
                  :options="totalTalentTypeList"
                  :multiple="true"
                  placeholder="Select a talent type"
                  track-by="name"
                  label="name"
                  class="mb-3"
                >
                  <span slot="noResult">Oops! No talent type found.</span>
                </multiselect>
                <multiselect
                  v-model="region"
                  :options="totalRegionList"
                  :multiple="false"
                  placeholder="Select a region"
                  track-by="name"
                  label="name"
                  class="mb-3"
                >
                  <span slot="noResult">Oops! No region found.</span>
                </multiselect>
                <b-form-group label="Gender">
                  <b-form-radio-group
                    v-model="selGender"
                    :options="totalGenderList"
                    buttons
                    size="sm"
                    button-variant="outline-primary"
                  ></b-form-radio-group>
                </b-form-group>
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
      totaltotalCategoryList: [],
      talentTypes: [],
      totalTalentTypeList: [
        {name: 'Dancers'},
        {name: 'Dancers and/or Singers'},
      ],
      region: '',
      totalRegionList: [
        {name: 'All Regions', param: 'All'},
        {name: 'Eastern USA', param: 'eastern'},
        {name: 'Western USA', param: 'western'},
        {name: 'Central USA', param: 'central'},
        {name: 'Nationwide N.A.', param: 'nationwide'},
        {name: 'Canada', param: 'canada'},
        {name: 'Europe', param: 'europe'},
        {name: 'Asia', param: 'asia'},
      ],
      selGender: 'All',
      totalGenderList: [
        {text: 'Both', value: 'All'},
        {text: 'Male', value: 'male'},
        {text: 'Female', value: 'female'},
      ],
      metaItems: {
        site: 'DancePlug',
        title: 'Dance Auditions, Jobs & Castings Calls | DancePlug',
        description:
          'Find the latest dance auditions, casting calls and job openings across the world, including the United States, Canada, Europe and Australia.',
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
          await this.fetchAuditions(page);
        }
        this.isLoading = false;
      },
    },
  },
  async mounted() {
    await this.fetchCategories();
  },
  methods: {
    async fetchAuditions(page) {
      const kw = this.buildKeywordQuery(this.keyword);
      let cat = '';
      if (this.categories.length > 0) {
        cat += this.buildCategoriesQuery(this.categories);
      }
      if (this.talentTypes.length > 0) {
        cat += this.buildTalentQuery(this.talentTypes);
      }
      if (this.region != '' && this.region.param != 'All') {
        cat += '&region=' + this.region.param;
      }
      if (this.selGender != 'all') {
        cat += '&gender=' + this.selGender;
      }
      let requestUrl = '/api/v1/auditions?keywords=' + kw + cat;
      const index = page - 1;
      if (index > 0) requestUrl = requestUrl + '&page=' + index;
      await this.$axios
          .get(requestUrl, {
            headers: {'Access-Control-Allow-Origin': '*'},
          })
          .then(async (response) => {
            this.loadedNodes = [];
            response.data.rows.forEach((audition) => {
              this.loadedNodes.push(audition);
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
      this.talentTypes = [];
      this.region = '';
      this.selGender = 'All';
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
      await this.fetchAuditions(1);
      this.isLoading = false;
    },
    async fetchCategories() {
      await this.$axios
          .get('/api/v1/auditions/tax', {
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
      let text = '&category=';
      for (let i = 0; i < contentArray.length; i++) {
        const part = contentArray[i].category
            .replace(/\//g, '+')
            .replace('&', '%26');
        text = text + (i == 0 ? '' : ',') + part;
      }
      return text;
    },
    buildTalentQuery(contentArray) {
      let text = '&talent=';
      for (let i = 0; i < contentArray.length; i++) {
        const part = contentArray[i].name
            .replace(/\//g, '+')
            .replace('&', '%26');
        text = text + (i == 0 ? '' : ',') + part;
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
          href: 'https://www.danceplug.com/auditions',
        },
        {
          rel: 'prev',
          href:
            'https://www.danceplug.com/auditions/' +
            (this.pager.currentPage == undefined || this.pager.currentPage == 1 ?
              '' :
              '?page=' + (this.pager.currentPage - 1)),
        },
        {
          rel: 'next',
          href:
            'https://www.danceplug.com/auditions/' +
            '?page=' +
            (this.pager.currentPage == undefined || this.pager.currentPage == 1 ?
              2 :
              this.pager.currentPage + 1),
        },
      ],
    };
  },
};
</script>
