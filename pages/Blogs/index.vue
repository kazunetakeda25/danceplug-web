<template>
  <div>
    <AppHeader class="iris-yonder">Latest Dance Blogs</AppHeader>
    <client-only>
      <loading :active.sync="isLoading" color="#13B4D1" full-page="true" />
      <go-top />
    </client-only>
    <Intro>
      Keep yourself updated with the latest dance blogs right here on DancePlug.
      From ballet to Broadway, breaking blogs to random facts, we've got you
      covered!
      <div slot="action" class="actions">
        <b-link to="/newsletter" class="btn btn-primary">Sign Me Up</b-link>
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
                />
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
      metaItems: {
        site: 'DancePlug',
        title: 'Dance Blog | DancePlug',
        description: 'Keep up to date with all DancePlug\'s news.',
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
          await this.fetchBlogs(page);
        }
        this.isLoading = false;
      },
    },
  },
  methods: {
    async fetchBlogs(page) {
      const kw = this.buildKeywordQuery(this.keyword);
      let requestUrl = '/api/v1/blogs?keywords=' + kw;
      const index = page - 1;
      if (index > 0) requestUrl = requestUrl + '&page=' + index;
      await this.$axios
          .get(requestUrl, {
            headers: {'Access-Control-Allow-Origin': '*'},
          })
          .then(async (response) => {
            this.loadedNodes = [];
            response.data.rows.forEach((blog) => {
              this.loadedNodes.push(blog);
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
      await this.fetchBlogs(1);
      this.isLoading = false;
    },
    buildKeywordQuery(content) {
      return content.replace(/\//g, '+').replace('&', '%26');
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
          href: 'https://www.danceplug.com/blogs',
        },
        {
          rel: 'prev',
          href:
            'https://www.danceplug.com/blogs' +
            (this.pager.currentPage == undefined || this.pager.currentPage == 1 ?
              '' :
              '?page=' + this.pager.currentPage - 1),
        },
        {
          rel: 'next',
          href:
            'https://www.danceplug.com/blogs?page=' +
            (this.pager.currentPage == undefined || this.pager.currentPage == 1 ?
              2 :
              this.pager.currentPage + 1),
        },
      ],
    };
  },
};
</script>
