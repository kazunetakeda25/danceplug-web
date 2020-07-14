<template>
  <div>
    <client-only>
      <loading :active.sync="isLoading" color="#13B4D1" full-page="true" />
      <go-top />
    </client-only>
    <div v-if="isUserPage == true">
      <AppHeader :image="data.cover" />
      <PageHolder
        class="profile"
        :title="data.title"
        :tax="data.styles"
        enable-sumo="false"
        no-header="true"
      >
        <div class="author-info">
          <div class="avatar-sp">
            <div class="col">
              <div
                class="cols-avatar picture-rounded-circle"
                v-html="data.image"
              />
            </div>
          </div>
          <h1>{{ data.title }}</h1>
          <small v-if="data.role" class="tax">{{ data.role }}</small>
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
        </div>

        <b-tabs content-class="profile-tabs">
          <b-tab title="About" active>
            <p v-html="data.bio" />
            <h2 v-if="data.contact_phone || data.contact_email">Contact</h2>
            <ul
              v-if="data.contact_phone || data.contact_email"
              class="list-unstyled"
            >
              <li v-if="data.contact_phone">{{ data.contact_phone }}</li>
              <li v-if="data.contact_email">{{ data.contact_email }}</li>
            </ul>
          </b-tab>
          <b-tab v-if="data.photos" title="Photos">
            <div id="gallery" v-html="data.photos" />
          </b-tab>
          <b-tab v-if="data.videos" title="Videos">
            <div id="videos" v-html="data.videos" />
          </b-tab>
        </b-tabs>
      </PageHolder>
    </div>
    <div v-else>
      <PageNotFound404 v-if="isLoading == false && isPageLoaded == true" />
    </div>
  </div>
</template>

<script>
import PageHolder from '@/assets/components/PageHolder';
import IconSocial from '@/assets/components/IconSocial';
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

export default {
  components: {
    PageHolder,
    IconSocial,
  },
  data() {
    return {
      data: {},
      isLoading: false,
      isUserPage: false,
      userId: null,
      isPageLoaded: false,
      instructorsList: [],
      metaItems: {
        site: 'DancePlug',
        descriptionFront: 'View ',
        descriptionEnd:
          '\'s profile on DancePlug, your #1 dance network for all dance professionals. Join today and get booked tomorrow!',
      },
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
    };
  },
  async mounted() {
    await this.checkIfUserPage();
    this.isLoading = true;
    if (this.isUserPage == true && this.userId != null) {
      await this.$axios
          .get('/api/v1/users/' + this.userId, {
            headers: {'Access-Control-Allow-Origin': '*'},
          })
          .then((response) => {
            this.data = response.data[0];
            this.socialItems[0].link = this.data.ig;
            this.socialItems[1].link = this.data.tw;
            this.socialItems[2].link = this.data.yt;
            this.socialItems[3].link = this.data.fb;
          });
    }
    this.isLoading = false;
    this.isPageLoaded = true;
  },
  methods: {
    async checkIfUserPage() {
      await this.$axios
          .get('/api/v1/users/simple', {
            headers: {'Access-Control-Allow-Origin': '*'},
          })
          .then((response) => {
            if (response.data != undefined && response.data.length > 0) {
              response.data.forEach((item) => {
                const slug = this.buildSlug(entities.decode(item.title));
                if (slug == this.$route.params.User) {
                  this.isUserPage = true;
                  this.userId = item.uid;
                }
              });
            }
          });
    },
    buildSlug(content) {
      return content
          .replace(/ \u0026amp; /g, '-')
          .replace(/\//g, '-')
          .replace(/ /g, '-')
          .toLowerCase();
    },
  },
  metaInfo() {
    return {
      title: this.data.title + ' | DancePlug',
      meta: [
        {
          name: 'description',
          content:
            this.metaItems.descriptionFront +
            this.data.title +
            this.metaItems.descriptionEnd,
        },
        {
          name: 'og:title',
          content: this.data.title + ' | ' + this.metaItems.site,
        },
        {
          name: 'og:description',
          content:
            this.metaItems.descriptionFront +
            this.data.title +
            this.metaItems.descriptionEnd,
        },
        {name: 'og:url', content: this.pageUrl},
        {name: 'og:image', content: this.metaItems.coverImage},
        {
          name: 'twitter:title',
          content: this.data.title + ' | ' + this.metaItems.site,
        },
        {
          name: 'twitter:description',
          content:
            this.metaItems.descriptionFront +
            this.data.title +
            this.metaItems.descriptionEnd,
        },
        {
          name: 'twitter:card',
          content: this.metaItems.coverImage ? 'summary_large_image' : 'summary',
        },
        {name: 'twitter:url', content: this.pageUrl},
        {name: 'twitter:image', content: this.data.image},
      ].filter((x) => x.content),
      link: [
        {
          rel: 'canonical',
          href: 'https://www.danceplug.com/' + this.$route.params.User,
        },
      ],
    };
  },
};
</script>
