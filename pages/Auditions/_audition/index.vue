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
        :calltype="data.calltype"
        enable-sumo="false"
        no-header="false"
      >
        <div v-if="data.body" v-html="data.body" />
        <div v-if="data.location" v-html="data.location" />
        <div v-if="data.production" v-html="data.production" />
        <div v-if="data.fee" v-html="data.fee" />
      </PageHolder>
      <PriceAudition section-title="Pricing" />
    </div>
    <div v-else-if="pageType == true">
      <AppHeader class="iris-yonder">{{ this.pageCategory }}</AppHeader>
      <Intro
        >Find {{ this.pageCategory }} dance auditions, casting calls and job
        openings across the world, including the United States, Canada, Europe
        and Australia.
        <div class="actions">
          <b-link to="/pricing/classes" class="btn btn-primarypink"
            >Get Started</b-link
          >
          <b-link to="/list/audition" class="btn btn-ghost"
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
    <div v-else>
      <PageNotFound404 v-if="isLoading == false" />
    </div>
  </div>
</template>

<script>
import PageHolder from '@/assets/components/PageHolder';
import PriceAudition from '@/assets/components/Pricing/PriceAudition';
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
    PriceAudition,
    CardPreview,
  },
  data() {
    return {
      data: {},
      loadedNodes: [],
      isLoading: null,
      pageType: null,
      isFilterHidden: true,
      pager: {},
      keyword: '',
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
      pageCategory: '',
      metaItems: {
        site: 'DancePlug',
        descriptionFront: 'Find ',
        descriptionEnd:
          ', dance auditions, casting calls and job openings across the world, including the United States, Canada, Europe and Australia.',
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
        if (this.pageType != true) {
          await this.isCategoryPage();
        }
        if (this.pageType == true) {
          page = parseInt(page) || 1;
          if (page !== this.pager.currentPage) {
            await this.fetchAuditions(page);
          }
        } else {
          await this.fetchAuditionNode();
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
    // buildCategoryQuery(content) {
    //   return content.replace(/\//g, "+").replace("&", "%26");
    // },
    buildKeywordQuery(content) {
      return content.replace(/\//g, '+').replace('&', '%26');
    },
    async isCategoryPage() {
      const response = await this.$axios.get('/api/v1/auditions/tax', {
        headers: {'Access-Control-Allow-Origin': '*'},
      });
      const categoryData = response.data.filter(
          (item) =>
            this.buildCategorySlug(item.category) ===
          this.$route.params.audition.toLowerCase(),
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
      this.talentTypes = [];
      this.selGender = 'All';
      this.region = '';
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
    async fetchAuditions(page) {
      const kw = this.buildKeywordQuery(this.keyword);
      let cat = this.pageCategory;
      if (this.talentTypes.length > 0) {
        cat += this.buildTalentQuery(this.talentTypes);
      }
      if (this.region != '' && this.region.param != 'All') {
        cat += '&region=' + this.region.param;
      }
      if (this.selGender != 'all') {
        cat += '&gender=' + this.selGender;
      }
      let requestUrl = '/api/v1/auditions?keywords=' + kw + '&category=' + cat;
      const index = page - 1;
      if (index > 0) requestUrl = requestUrl + '&page=' + index;
      await this.$axios
          .get(requestUrl, {
            headers: {'Access-Control-Allow-Origin': '*'},
          })
          .then((response) => {
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
    async fetchAuditionNode() {
      const path = this.$route.path;
      await this.$axios
          .get('/api/v1/auditions/all', {
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
                  .get('/api/v1/auditions/' + nid, {
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
          this.pageCategory + ' - Dance Auditions | ' + this.metaItems.site :
          this.pageType == false ?
          this.data.title + ' | Dance Audition | ' + this.metaItems.site :
          this.metaItems.site,
      meta: [
        {
          property: 'og:title',
          content:
            this.pageType == true ?
              this.pageCategory + ' | Dance Auditions' :
              this.pageType == false ?
              this.data.title + ' | Dance Audition' :
              this.metaItems.site,
        },
        {
          property: 'og:url',
          content:
            this.pageType == true ?
              'https://www.danceplug.com/auditions/' +
                this.$route.params.audition :
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
              this.pageCategory + ' | Dance Auditions' :
              this.pageType == false ?
              this.data.title + ' | Dance Audition' :
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
              'https://www.danceplug.com/auditions/' +
                this.$route.params.audition :
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
              'https://www.danceplug.com/auditions/' +
                this.$route.params.audition :
              'https://www.danceplug.com' + this.data.link,
        },
        {
          rel: 'prev',
          href:
            this.pageType == true ?
              'https://www.danceplug.com/audition/' +
                this.$route.params.audition +
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
              'https://www.danceplug.com/auditions/' +
                this.$route.params.audition +
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
