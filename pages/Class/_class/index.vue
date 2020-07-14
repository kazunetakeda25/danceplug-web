<template>
  <div>
    <client-only>
      <loading :active.sync="isLoading" color="#13B4D1" full-page="true" />
      <go-top />
    </client-only>
    <div v-if="pageType == true">
      <AppHeader class="iris-yonder">{{ this.pageCategory }}</AppHeader>
      <Intro
        >Enjoy our selection of {{ this.pageCategory }} dance classes, and learn
        choreography from the best dance teachers, across a variety of styles
        for any skill level.</Intro
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
                  ></b-input>
                  <multiselect
                    v-if="this.typeType == ''"
                    v-model="categories"
                    :options="totalCategoryList"
                    placeholder="Select a Type"
                    track-by="type"
                    label="type"
                    class="mb-3"
                  >
                    <span slot="noResult">Oops! No category found.</span>
                  </multiselect>
                  <multiselect
                    v-if="this.levelType == ''"
                    v-model="level"
                    :options="totalLevelList"
                    placeholder="Select a Level"
                    track-by="level"
                    label="level"
                    class="mb-3"
                  >
                    <span slot="noResult">Oops! No result found.</span>
                  </multiselect>
                  <multiselect
                    v-if="this.styleType == ''"
                    v-model="selStyle"
                    :options="totalStyleList"
                    placeholder="Select Styles"
                    :multiple="true"
                    track-by="style"
                    label="style"
                    class="mb-3"
                  >
                    <span slot="noResult">Oops! No result found.</span>
                  </multiselect>
                  <multiselect
                    v-if="this.instructorType == ''"
                    v-model="instructors"
                    :options="totalInstructorList"
                    placeholder="Select Insturctors"
                    :multiple="true"
                    track-by="instructor"
                    label="instructor"
                    class="mb-3"
                  >
                    <span slot="noResult">Oops! No result found.</span>
                  </multiselect>
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
      <CardPreviewClass :nodes="loadedNodes" />
      <div class="pager">
        <Paginator :pager="pager" />
      </div>
    </div>
    <div v-else-if="pageType == false">
      <AppHeader />
      <PageHolder
        class="hero-hide"
        :flag="data.flag"
        :title="data.title"
        :level="data.level"
        :style_block="data.style"
        :type="data.type"
        :video="data.preview"
        :image="data.image"
        enable-sumo="false"
        no-header="false"
      >
        <div v-html="data.body" />
        <div v-html="data.instructor" />
        <div v-html="data.music" />
      </PageHolder>
      <PriceClass section-title="Pricing" />
    </div>
    <div v-else>
      <PageNotFound404 v-if="isLoading == false" />
    </div>
  </div>
</template>

<script>
import CardPreviewClass from '@/assets/components/Cards/CardPreviewClass';
import PriceClass from '@/assets/components/Pricing/PriceClass';
import PageHolder from '@/assets/components/PageHolder';
const paginate = require('jw-paginate');
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

let VueScrollTo = false;
if (process.browser) {
  VueScrollTo = require('vue-scrollto');
}

export default {
  components: {
    CardPreviewClass,
    PageHolder,
    PriceClass,
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
      levelType: '',
      styleType: '',
      typeType: '',
      instructorType: '',
      totalCategoryList: [],
      categories: '',
      totalLevelList: [],
      level: '',
      totalInstructorList: [],
      instructors: [],
      selStyle: [],
      totalStyleList: [],
      metaItems: {
        site: 'DancePlug',
        descriptionFront: 'Enjoy our selection of ',
        descriptionEnd:
          ', and learn choreography from the best dance teachers, across a variety of styles for any skill level.',
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
            await this.fetchClasses(page);
          }
        } else {
          await this.fetchClassNode();
        }
        this.isLoading = false;
      },
    },
  },
  methods: {
    async fetchCategories() {
      await this.$axios
          .get('/api/v1/classes/type', {
            headers: {'Access-Control-Allow-Origin': '*'},
          })
          .then((response) => {
            this.totalCategoryList = response.data;
            this.totalCategoryList.forEach((item) => {
              item.type = entities.decode(item.category);
            });
            this.totalCategoryList.unshift({type: '- Any -'});
          });
    },
    async fetchInsturctors() {
      await this.$axios
          .get('/api/v1/instructors/simple', {
            headers: {'Access-Control-Allow-Origin': '*'},
          })
          .then((response) => {
            this.totalInstructorList = response.data;
            this.totalInstructorList.forEach((item) => {
              item.instructor = entities.decode(item.title);
            });
          });
    },
    async fetchStyles() {
      await this.$axios
          .get('/api/v1/classes/style', {
            headers: {'Access-Control-Allow-Origin': '*'},
          })
          .then((response) => {
            this.totalStyleList = response.data;
            this.totalStyleList.forEach((item) => {
              item.style = entities.decode(item.category);
            });
          });
    },
    async fetchLevels() {
      await this.$axios
          .get('/api/v1/classes/level', {
            headers: {'Access-Control-Allow-Origin': '*'},
          })
          .then((response) => {
            this.totalLevelList = response.data;
            this.totalLevelList.forEach((item) => {
              item.level = entities.decode(item.category);
            });
            this.totalLevelList.unshift({level: '- Any -'});
          });
    },
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
    buildInstructorQuery(contentArray) {
      let text = '&instructor=';
      for (let i = 0; i < contentArray.length; i++) {
        const part = contentArray[i].instructor
            .replace(/\//g, '+')
            .replace('&', '%26');
        // part = part + "+(" + contentArray[i].tid + ")";
        text = text + ',' + part;
      }
      return text;
    },
    buildKeywordQuery(content) {
      return content.replace(/\//g, '+').replace('&', '%26');
    },
    buildStyleQuery(contentArray) {
      let text = '&style=';
      for (let i = 0; i < contentArray.length; i++) {
        const part = contentArray[i].style
            .replace(/\//g, '+')
            .replace('&', '%26');
        // part = part + "+(" + contentArray[i].tid + ")";
        text = text + ',' + part;
      }
      return text;
    },
    async isCategoryPage() {
      let response = await this.$axios.get('/api/v1/classes/level', {
        headers: {'Access-Control-Allow-Origin': '*'},
      });
      let categoryData = response.data.filter(
          (item) =>
            this.buildCategorySlug(item.category) ===
          this.$route.params.class.toLowerCase(),
      );
      if (categoryData.length > 0) {
        this.pageType = true;
        this.levelType = this.pageCategory = entities.decode(
            categoryData[0].category,
        );
        this.fetchStyles();
        this.fetchInsturctors();
        this.fetchCategories();
        return true;
      }
      response = await this.$axios.get('/api/v1/classes/style', {
        headers: {'Access-Control-Allow-Origin': '*'},
      });
      categoryData = response.data.filter(
          (item) =>
            this.buildCategorySlug(item.category) ===
          this.$route.params.class.toLowerCase(),
      );
      if (categoryData.length > 0) {
        this.pageType = true;
        this.styleType = this.pageCategory = entities.decode(
            categoryData[0].category,
        );
        this.fetchLevels();
        this.fetchInsturctors();
        this.fetchCategories();
        return true;
      }
      response = await this.$axios.get('/api/v1/classes/type', {
        headers: {'Access-Control-Allow-Origin': '*'},
      });
      categoryData = response.data.filter(
          (item) =>
            this.buildCategorySlug(item.category) ===
          this.$route.params.class.toLowerCase(),
      );
      if (categoryData.length > 0) {
        this.pageType = true;
        this.typeType = this.pageCategory = entities.decode(
            categoryData[0].category,
        );
        this.fetchLevels();
        this.fetchInsturctors();
        this.fetchStyles();
        return true;
      }
      response = await this.$axios.get('/api/v1/instructors/simple', {
        headers: {'Access-Control-Allow-Origin': '*'},
      });
      categoryData = response.data.filter(
          (item) =>
            this.buildCategorySlug(item.title).replace(/ /g, '-') ===
          this.$route.params.class.toLowerCase(),
      );
      if (categoryData.length > 0) {
        this.pageType = true;
        this.instructorType = this.pageCategory = entities.decode(
            categoryData[0].title,
        );
        this.fetchLevels();
        this.fetchCategories();
        this.fetchStyles();
        return true;
      }
      return false;
    },
    reset() {
      this.keyword = '';
      this.categories = [];
      this.level = '';
      (this.instructors = []), (this.selStyle = []);
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
      await this.fetchClasses(1);
      this.isLoading = false;
    },
    async fetchClasses(page) {
      const kw = this.buildKeywordQuery(this.keyword);
      console.log(this.level.level);
      let cat = '';
      if (this.level != '' && this.level.level != '- Any -') {
        cat += '&level=' + this.buildCategoryQuery(this.level.level);
      }
      if (this.categories != '' && this.categories.type != '- Any -') {
        cat += '&type=' + this.buildCategoryQuery(this.categories.type);
      }
      if (this.instructors.length > 0) {
        cat += this.buildInstructorQuery(this.instructors);
      }
      if (this.selStyle.length > 0) {
        cat += this.buildStyleQuery(this.selStyle);
      }
      if (this.instructorType) {
        cat += '&instructor=' + this.buildCategoryQuery(this.instructorType);
      }
      if (this.levelType) {
        cat += '&level=' + this.buildCategoryQuery(this.levelType);
      }
      if (this.typeType) {
        cat += '&type=' + this.buildCategoryQuery(this.typeType);
      }
      if (this.styleType) {
        cat += '&style=' + this.buildCategoryQuery(this.styleType);
      }
      let requestUrl = '/api/v1/classes?keywords=' + kw + cat;
      const index = page - 1;
      if (index > 0) requestUrl = requestUrl + '&page=' + index;
      await this.$axios
          .get(requestUrl, {
            headers: {'Access-Control-Allow-Origin': '*'},
          })
          .then((response) => {
            this.loadedNodes = [];
            response.data.rows.forEach((classes) => {
              this.loadedNodes.push(classes);
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
    async fetchClassNode() {
      const path = this.$route.path;
      await this.$axios
          .get('/api/v1/classes/all', {
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
                  .get('/api/v1/classes/' + nid, {
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
          this.pageCategory +
            ' - Online Dance Classes | ' +
            this.metaItems.site :
          this.pageType == false ?
          this.data.title +
            ' | ' +
            this.pageCategory +
            'Dance Tutorial by ' +
            this.data.instructor :
          this.metaItems.site,
      meta: [
        {
          property: 'og:title',
          content:
            this.pageType == true ?
              this.pageCategory + ' | Online Dance Classes' :
              this.pageType == false ?
              this.data.title +
                ' | ' +
                this.pageCategory +
                'Dance Tutorial by ' +
                this.data.instructor :
              this.metaItems.site,
        },
        {
          property: 'og:url',
          content:
            this.pageType == true ?
              'https://www.danceplug.com/class/' + this.$route.params.class :
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
                ' dance classes' +
                this.metaItems.descriptionEnd :
              this.data.seo_description,
        },
        {
          property: 'og:description',
          content:
            this.pageType == true ?
              this.metaItems.descriptionFront +
                this.pageCategory +
                ' dance classes' +
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
              this.pageCategory + ' | Online Dance Classes' :
              this.pageType == false ?
              this.data.title +
                ' | ' +
                this.pageCategory +
                'Dance Tutorial by ' +
                this.data.instructor :
              this.metaItems.site,
        },
        {
          property: 'twitter:description',
          content:
            this.pageType == true ?
              this.metaItems.descriptionFront +
                this.pageCategory +
                ' dance classes' +
                this.metaItems.descriptionEnd :
              this.data.seo_description,
        },
        {
          property: 'twitter:url',
          content:
            this.pageType == true ?
              'https://www.danceplug.com/class/' + this.$route.params.class :
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
              'https://www.danceplug.com/class/' + this.$route.params.class :
              'https://www.danceplug.com' + this.data.link,
        },
        {
          rel: 'prev',
          href:
            this.pageType == true ?
              'https://www.danceplug.com/class/' +
                this.$route.params.class +
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
              'https://www.danceplug.com/class/' +
                this.$route.params.class +
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
