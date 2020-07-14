<template>
  <div>
    <client-only>
      <loading :active.sync="isLoading" color="#13B4D1" full-page="true" />
      <go-top />
    </client-only>
    <AppHeader
      class="home"
      image='<picture>
              <source srcset="//dev.cms.danceplug.com/sites/default/files/styles/1920/public/images/misc/homepage-renee.jpg?itok=6bXTDrJc 1x, //dev.cms.danceplug.com/sites/default/files/styles/3840/public/images/misc/homepage-renee.jpg?itok=CRYZgNSH 2x" media="all and (min-width: 1200px)" type="image/jpeg">
              <source srcset="//dev.cms.danceplug.com/sites/default/files/styles/1200/public/images/misc/homepage-renee.jpg?itok=6Jp2orza 1x, //dev.cms.danceplug.com/sites/default/files/styles/2400/public/images/misc/homepage-renee.jpg?itok=zTg9FDac 2x" media="all and (max-width: 1199px)" type="image/jpeg">
              <source srcset="//dev.cms.danceplug.com/sites/default/files/styles/800/public/images/misc/homepage-renee.jpg?itok=YOaPrs3y 1x, //dev.cms.danceplug.com/sites/default/files/styles/1600/public/images/misc/homepage-renee.jpg?itok=0oGWczFZ 2x" media="all and (max-width: 991px)" type="image/jpeg">
              <img src="//dev.cms.danceplug.com/sites/default/files/styles/800/public/images/misc/homepage-renee.jpg?itok=YOaPrs3y">
            </picture>'
    >
      <div slot="home-welcome">
        <h1 class="display-1"><span>your</span> connection <br />to dance</h1>
        <p class="lead">
          One hub to take online dance classes, find audition and whatever else
          we want to say here
        </p>
      </div>
    </AppHeader>

    <section id="class-intro" class="container">
      <b-row>
        <b-col xl="6">
          <div class="holder">
            <h2 class="display-2">online dance classes</h2>
            <p>
              Your pace. Your space. DancePlug offers you a range of dance
              classes across numerous dance genres. From ballet to hip-hop and
              even Bollywood, we have a class just for you. Learn from our
              easy-to-follow and customizable dance tutorials. Subscribe to a
              class plan and get access to over 600 combinations, exercises,
              fundamentals and warmups for any skill level.
            </p>
            <b-btn class="btn btn-secondary" to="/classes">More Info</b-btn>
          </div>
        </b-col>
        <b-col xl="6">
          <b-embed
            type="iframe"
            aspect="16by9"
            src="https://videos.danceplug.com/players/rtMwC6Zl-iJPjLml8.html"
            allowfullscreen
          />
          <Bars class="bars-left bars-iris" />
        </b-col>
      </b-row>
    </section>

    <section id="audition-intro" class="iris-yonder text-white">
      <div class="container">
        <b-row>
          <b-col xl="6">
            <div class="audition-holder">
              <picture>
                <source
                  srcset="
                    //dev.cms.danceplug.com/sites/default/files/styles/800/public/images/misc/dancer-ballet.jpg?itok=tuXvUMCo  1x,
                    //dev.cms.danceplug.com/sites/default/files/styles/1600/public/images/misc/dancer-ballet.jpg?itok=Zw28urJt 2x
                  "
                  media="all and (max-width: 767px)"
                  type="image/jpeg"
                />
                <img
                  class="aud-3"
                  src="//dev.cms.danceplug.com/sites/default/files/styles/800/public/images/misc/dancer-ballet.jpg?itok=mGGCT4nU"
                />
              </picture>
              <b-link
                v-for="item in auditions"
                :key="item.id"
                :to="item.link"
                :class="'aud-' + item.id"
                v-html="item.image"
              />
              <Bars class="bars-left bars-iris" />
            </div>
          </b-col>
          <b-col xl="6">
            <div class="holder">
              <h2 class="display-2">dance auditions</h2>
              <p>
                Find the latest dance auditions, casting calls and job openings
                across the world, including the United States, Canada, Europe
                and Australia. Subscribe to an audition plan and get unlimited
                access to all our listings. If you are looking to hire dancers
                or fill a dance job position, you can add your post for free and
                reach thousands of talents ready to work.
              </p>
              <b-btn class="btn-light" to="/auditions">More Info</b-btn>
            </div>
          </b-col>
        </b-row>
      </div>
    </section>

    <Quote :quotes="references" class="quotes" />

    <Cols2
      color="bg-plum"
      image="//dev.cms.danceplug.com/sites/default/files/styles/1920/public/images/misc/dancer-hiphop.jpg?itok=sDBc5CYP"
    >
      <h2 slot="text" class="display-2">
        <span class="first">Latest</span>
        <span class="last">Articles</span>
      </h2>
    </Cols2>

    <Latest :latest-items="articles" class="plum-ruby" />
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader';
import Latest from '@/assets/components/Latest';
import Bars from '@/assets/components/Bars';
import Cols2 from '@/assets/components/Cols/Cols2';
import Quote from '@/assets/components/Quote';
export default {
  components: {
    AppHeader,
    Latest,
    Cols2,
    Bars,
    Quote,
  },
  data() {
    return {
      isLoading: false,
      auditions: {},
      articles: {},
      references: {},
      metaItems: {
        site: 'DancePlug',
        title:
          'Online Dance Classes, Choreography & Dance Auditions | DancePlug',
        description:
          'Take online dance classes, learn choreography and apply to the latest dance auditions across the globe. Join today, be inspired, and get booked.',
        coverImage:
          'https://cdn.danceplug.com/sites/default/files/dplogo_og.png',
      },
    };
  },
  async mounted() {
    this.isLoading = true;
    await this.$axios
        .get('/api/v1/auditions/random', {
          headers: {'Access-Control-Allow-Origin': '*'},
        })
        .then((response) => {
          this.auditions = [];
          if (response.data != undefined) {
            let index = 1;
            response.data.forEach((item) => {
              const audition = {
                id: index,
                link: item.link,
                image: item.image,
              };
              this.auditions.push(audition);
              index++;
            });
          }
        });
    await this.$axios
        .get('/api/v1/articles/latest', {
          headers: {'Access-Control-Allow-Origin': '*'},
        })
        .then((response) => {
          this.articles = response.data;
        });
    await this.$axios
        .get('/api/v1/references', {
          headers: {'Access-Control-Allow-Origin': '*'},
        })
        .then((response) => {
          this.references = response.data;
        });
    this.isLoading = false;
  },
  metaInfo() {
    return {
      title: this.metaItems.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.metaItems.description,
        },
        {hid: 'og:title', name: 'og:title', content: this.metaItems.title},
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.metaItems.description,
        },
        {hid: 'og:url', name: 'og:url', content: this.pageUrl},
        {
          hid: 'og:image',
          name: 'og:image',
          content: this.metaItems.coverImage,
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.metaItems.title,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.metaItems.description,
        },
        {
          hide: 'twitter:card',
          name: 'twitter:card',
          content: this.metaItems.coverImage ? 'summary_large_image' : 'summary',
        },
        {hid: 'twitter:url', name: 'twitter:url', content: this.pageUrl},
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: this.metaItems.coverImage,
        },
      ].filter((x) => x.content),
      link: [{rel: 'canonical', href: 'https://www.danceplug.com'}],
    };
  },
};
</script>
