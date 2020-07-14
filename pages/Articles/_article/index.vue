<template>
  <div>
    <client-only>
      <loading :active.sync="isLoading" color="#13B4D1" full-page="true" />
      <go-top />
    </client-only>
    <div v-if="pageType == true">
      <AppHeader class="iris-yonder"
        >{{ this.pageCategory }} Dance Articles</AppHeader
      >
      <Intro>
        Learn how to become a smarter dancer and pick up tips by reading our
        latest dance
        {{ this.pageCategory }} articles.
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
      <AppHeader :image="data.image" />
      <PageHolder
        :title="data.title"
        :credit="data.caption"
        :tax="data.category"
        :author="data.author"
        :date="data.date"
        :readtime="data.readtime"
        enable-sumo="true"
        no-header="false"
      >
        <div v-html="data.body" />
        <div slot="authorInfo" class="author-info article-author">
          <div v-if="data.avatar" class="avatar-sp">
            <div class="col">
              <div class="cols-avatar picture-rounded-circle">
                <a
                  :href="data.author_link"
                  target="_self"
                  v-html="data.avatar"
                />
              </div>
            </div>
          </div>
          <h2>{{ data.author }}</h2>
          <ul class="list-inline sm">
            <li
              v-for="item in socialItems"
              :key="item.id"
              class="list-inline-item"
            >
              <IconSocial
                v-if="item.link != ''"
                :link="item.link"
                :title="item.follow"
                :name="item.name"
              />
            </li>
          </ul>
          <div v-html="data.bio" />
        </div>
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
      socialItems: [
        {
          name: 'icon-instagram',
          link: '',
          follow: 'Follow me on Instagram',
        },
        {
          name: 'icon-twitter',
          link: '',
          follow: 'Follow me on Twitter',
        },
        {
          name: 'icon-youtube',
          link: '',
          follow: 'Subscribe to my Youtube Channel',
        },
        {
          name: 'icon-facebook',
          link: '',
          follow: 'Like me on Facebook',
        },
      ],
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
        descriptionFront:
          'Learn how to become a smarter dancer and pick up tips by reading our latest dance ',
        descriptionEnd: ' articles.',
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
            await this.fetchArticles(page);
          }
        } else {
          await this.fetchArticleNode();
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
      const response = await this.$axios.get('/api/v1/articles/tax', {
        headers: {'Access-Control-Allow-Origin': '*'},
      });
      const categoryData = response.data.filter(
          (item) =>
            this.buildCategorySlug(item.category) ===
          this.$route.params.article.toLowerCase(),
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
      await this.fetchArticles(1);
      this.isLoading = false;
    },
    async fetchArticles(page) {
      const kw = this.buildKeywordQuery(this.keyword);
      const cat = this.buildCategoryQuery(this.pageCategory);
      let requestUrl = '/api/v1/articles?keywords=' + kw + '&category=' + cat;
      const index = page - 1;
      if (index > 0) requestUrl = requestUrl + '&page=' + index;
      await this.$axios
          .get(requestUrl, {
            headers: {'Access-Control-Allow-Origin': '*'},
          })
          .then((response) => {
            this.loadedNodes = [];
            response.data.rows.forEach((article) => {
              this.loadedNodes.push(article);
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
    async fetchArticleNode() {
      const path = this.$route.path;
      await this.$axios
          .get('/api/v1/articles/all', {
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
                  .get('/api/v1/articles/' + nid, {
                    headers: {'Access-Control-Allow-Origin': '*'},
                  })
                  .then((pageResponse) => {
                    this.data = pageResponse.data[0];
                    this.socialItems[0].link = this.data.ig;
                    this.socialItems[1].link = this.data.tw;
                    this.socialItems[2].link = this.data.yt;
                    this.socialItems[3].link = this.data.fb;
                    if (this.data.fb == '') this.socialItems.splice(3, 1);
                    if (this.data.yt == '') this.socialItems.splice(2, 1);
                    if (this.data.tw == '') this.socialItems.splice(1, 1);
                    if (this.data.ig == '') this.socialItems.splice(0, 1);
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
          this.pageCategory + ' - Dance Articles | ' + this.metaItems.site :
          this.pageType == false ?
          this.data.title + ' | Dance Article | ' + this.metaItems.site :
          this.metaItems.site,
      meta: [
        {
          property: 'og:title',
          content:
            this.pageType == true ?
              this.pageCategory + ' | Dance Articles' :
              this.pageType == false ?
              this.data.title + ' | Dance Article' :
              this.metaItems.site,
        },
        {
          property: 'og:url',
          content:
            this.pageType == true ?
              'https://www.danceplug.com/articles/' +
                this.$route.params.article :
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
              this.pageCategory + ' | Dance Articles' :
              this.pageType == false ?
              this.data.title + ' | Dance Article' :
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
              'https://www.danceplug.com/articles/' +
                this.$route.params.article :
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
              'https://www.danceplug.com/articles/' +
                this.$route.params.article :
              'https://www.danceplug.com' + this.data.link,
        },
        {
          rel: 'prev',
          href:
            this.pageType == true ?
              'https://www.danceplug.com/articles/' +
                this.$route.params.article +
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
              'https://www.danceplug.com/articles/' +
                this.$route.params.article +
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
