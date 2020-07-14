<template>
  <div>
    <client-only>
      <loading :active.sync="isLoading" color="#13B4D1" full-page="true" />
      <go-top />
    </client-only>
    <AppHeader class="iris-yonder">Online Dance Classes</AppHeader>
    <Intro>
      Easy-to-follow tutorials include instructor commentary with counts, speed
      control, slow motion, split screens, rewind 10 secs, section markers,
      captions and Apple TV air-play. Become a paid member to enjoy unlimited
      access to over 450 combinations, exercises, fundamentals and warmups for
      all skill level. FREE classes are available to view. New class tutorials
      added weekly.
    </Intro>

    <section id="class-affix" class="container">
      <b-row>
        <b-col id="affix" md="6" class="class-list d-none d-lg-block d-xl-block">
          <h2 class="display-2">
            <b-link
              id="anchor-tutorials"
              href="javascript:void(0);"
              @click="scrollToTutorials"
            >Tutorials</b-link>
          </h2>
          <h2 class="display-2">
            <b-link id="anchor-styles" href="javascript:void(0);" @click="scrollToStyles">Styles</b-link>
          </h2>
          <h2 class="display-2">
            <b-link id="anchor-levels" href="javascript:void(0);" @click="scrollToLevels">Levels</b-link>
          </h2>
          <div class="yourpace d-none d-lg-block d-xl-block">
            <span class="d-block">Your pace.</span>
            <span class="d-block">Your space.</span>
          </div>
        </b-col>
        <b-col col lg="6" offset-lg="6" class="class-list">
          <div id="tutorials" class="slider-info">
            <h2 class="display-2 d-none d-sm-block d-md-block d-lg-none d-xl-none">Tutorials</h2>
            <picture>
              <source
                srcset="//dev.cms.danceplug.com/sites/default/files/styles/800/public/images/misc/dancer-house.jpg?itok=UOsuIdir  1x, //dev.cms.danceplug.com/sites/default/files/styles/1600/public/images/misc/dancer-house.jpg?itok=Z0o0LwPo 2x"
                media="all and (min-width: 768px)"
                type="image/jpeg"
              />
              <source
                srcset="//dev.cms.danceplug.com/sites/default/files/styles/400/public/images/misc/dancer-house.jpg?itok=23cCqjFH 1x, //dev.cms.danceplug.com/sites/default/files/styles/800/public/images/misc/dancer-house.jpg?itok=UOsuIdir 2x"
                media="all and (max-width: 767px)"
                type="image/jpeg"
              />
              <img
                alt="Male house dancer"
                src="//dev.cms.danceplug.com/sites/default/files/styles/400/public/images/misc/dancer-house.jpg?itok=LtDlQzvd"
              />
            </picture>
            <p>
              Easy-to-follow tutorials include instructor commentary with
              counts, speed control, slow motion, split screens, rewind 10 secs,
              section markers, captions and Apple TV air-play. Become a paid
              member to enjoy unlimited access to over 450 combinations,
              exercises, fundamentals and warmups for all skill level. FREE
              classes are available to view. New class tutorials added weekly.
            </p>
          </div>
          <div id="styles" class="slider-info">
            <h2 class="display-2 d-none d-sm-block d-md-block d-lg-none d-xl-none">Styles</h2>
            <picture>
              <source
                srcset="//dev.cms.danceplug.com/sites/default/files/styles/800/public/images/misc/dancer-lyrical.jpg?itok=ChOqBD6O  1x, //dev.cms.danceplug.com/sites/default/files/styles/1600/public/images/misc/dancer-lyrical.jpg?itok=V53oOgf2 2x"
                media="all and (min-width: 768px)"
                type="image/jpeg"
              />
              <source
                srcset="//dev.cms.danceplug.com/sites/default/files/styles/400/public/images/misc/dancer-lyrical.jpg?itok=1LtqWXvc 1x, //dev.cms.danceplug.com/sites/default/files/styles/800/public/images/misc/dancer-lyrical.jpg?itok=ChOqBD6O 2x"
                media="all and (max-width: 767px)"
                type="image/jpeg"
              />
              <img
                alt="Female lyrical dancer"
                src="//dev.cms.danceplug.com/sites/default/files/styles/400/public/images/misc/dancer-lyrical.jpg?itok=3OzSsYtL"
              />
            </picture>
            <p>
              What flavor are you after? You have access to 450+ tutorials;
              they're separated into (types) warm ups, exercises, and
              combinations. Each type can be filtered by skill level and
              teacher!
            </p>
          </div>
          <div id="levels" class="slider-info">
            <h2 class="display-2 d-none d-sm-block d-md-block d-lg-none d-xl-none">Levels</h2>
            <picture>
              <source
                srcset="//dev.cms.danceplug.com/sites/default/files/styles/800/public/images/misc/dancer-funk.jpg?itok=PI6PUMsd  1x, //dev.cms.danceplug.com/sites/default/files/styles/1600/public/images/misc/dancer-funk.jpg?itok=Mh-1eRJG 2x"
                media="all and (min-width: 768px)"
                type="image/jpeg"
              />
              <source
                srcset="//dev.cms.danceplug.com/sites/default/files/styles/400/public/images/misc/dancer-funk.jpg?itok=XKNxUkY- 1x, //dev.cms.danceplug.com/sites/default/files/styles/800/public/images/misc/dancer-funk.jpg?itok=PI6PUMsd 2x"
                media="all and (max-width: 767px)"
                type="image/jpeg"
              />
              <img
                alt="Female jazz funk dancer"
                src="//dev.cms.danceplug.com/sites/default/files/styles/400/public/images/misc/dancer-funk.jpg?itok=tkJ7BZyg"
              />
            </picture>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </p>
          </div>
        </b-col>
      </b-row>
      <Bars class="bars-left bars-yonder" />
    </section>

    <section id="class-lastest" class="yonder-plum">
      <b-container class="text-white">
        <b-row>
          <ClassSlider :class-slides="classlist" />
          <b-col md="6" lg="8" class="d-none d-sm-none d-md-block d-lg-block d-xl-block">
            <span class="co-title d-block">600+</span>
            <span class="co-lead d-block">dance tutorials</span>
            <span class="co-lead d-block">and growing…</span>
          </b-col>
        </b-row>
      </b-container>
    </section>

    <Feature :features="loadedFeatures" />

    <section id="class-demo" class="container">
      <b-row>
        <b-col lg="10">
          <b-embed
            type="iframe"
            aspect="16by9"
            src="https://videos.danceplug.com/players/htrTdeDM-iJPjLml8.html"
            allowfullscreen
          />
        </b-col>
      </b-row>
      <Bars class="bars-right bars-ruby" />
    </section>

    <section id="instructors" class="container">
      <h2 class="display-2">Instructors</h2>
      <p class="lead mb-7">
        Learn to dance from the best dance teachers without traveling to Los
        Angeles, New York or across the globe. Our pool of educators have a
        combined wealth of experience as performers, choreographers, artistic
        directors and studio owners.
      </p>
      <div class="row col-avatar">
        <ColsAvatar
          v-for="item in colsItems"
          :key="item.id"
          :title="item.title"
          :image="item.image"
          :styles="item.styles"
          :link="item.link"
        />
      </div>
    </section>

    <Cols2
      color="bg-ruby"
      image="//dev.cms.danceplug.com/sites/default/files/styles/1920/public/images/misc/dancer-jazz.jpg?itok=QftLdLVk"
    >
      <h2 slot="text" class="display-2">
        <span class="first">You May</span>
        <span class="last">Wonder</span>
      </h2>
    </Cols2>

    <Faq :faqs="loadedFaqs" />

    <PriceClass section-title="Pricing" bar-direction="bars-right" class="pb-0" />

    <Quote :quotes="references" class="quotes" />
  </div>
</template>

<script>
import ColsAvatar from '@/assets/components/Cols/ColsAvatar';
import ClassSlider from '@/assets/components/ClassSlider';
import PriceClass from '@/assets/components/Pricing/PriceClass';
import Cols2 from '@/assets/components/Cols/Cols2';
import Bars from '@/assets/components/Bars';
import Feature from '@/assets/components/Feature';
import Quote from '@/assets/components/Quote';
import Faq from '@/assets/components/Faq';

let VueScrollTo = false;

if (process.browser) {
  VueScrollTo = require('vue-scrollto');
}

export default {
  components: {
    PriceClass,
    Cols2,
    Bars,
    Faq,
    Feature,
    Quote,
    ColsAvatar,
    ClassSlider,
  },
  data() {
    return {
      isLoading: false,
      colsItems: {},
      classlist: {},
      references: {},
      metaItems: {
        site: 'DancePlug',
        title: 'Online Dance Classes & Choreography | DancePlug',
        description:
          'Take online dance classes and learn choreography from the best dance teachers, across a variety of styles for any skill level. Sign up today!',
        coverImage:
          'https://cdn.danceplug.com/sites/default/files/dplogo_og.png',
      },
      loadedFaqs: [
        {
          fid: '1',
          question: 'Are DancePlug tutorials like an in-studio class?',
          answer:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        },
        {
          fid: '2',
          question: 'Can I download an Online Dance Class/Tutorial?',
          answer:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        },
        {
          fid: '3',
          question: 'What is your cancelation and refund policy?',
          answer:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        },
      ],
      loadedFeatures: [
        {
          featIcon: 'icon-eye-solid',
          featTitle: 'Viewing Angles',
          featDesc:
            'Choose between the Back View (as if you were behind the instructor) or the Mirrored View (as if you were looking at the instructor in the mirror). Each angle includes a split screen to catch details.',
        },
        {
          featIcon: 'icon-speed',
          featTitle: 'Learning Pace',
          featDesc:
            'Select the slow motion breakdown, then if needed adjust the speed of the video with the Speed Control feature. You also have the ability to do quick 10 second rewind.',
        },
        {
          featIcon: 'icon-marker-solid',
          featTitle: 'Section Markers',
          featDesc:
            'A selection of tutorials include markers to easily navigate back or skip forward to a section.',
        },
        {
          featIcon: 'icon-airplay',
          featTitle: 'Airplay',
          featDesc: 'Use airplay to view your video onto a television screen.',
        },
        {
          featIcon: 'icon-star',
          featTitle: 'Bookmarks',
          featDesc: 'Save videos in one place for later review',
        },
      ],
    };
  },
  async mounted() {
    this.isLoading = true;
    await this.$axios
        .get('/api/v1/instructors/random', {
          headers: {'Access-Control-Allow-Origin': '*'},
        })
        .then((response) => {
          this.colsItems = [];
          response.data.forEach((instructor) => {
            this.colsItems.push(instructor);
          });
        });
    await this.$axios
        .get('/api/v1/references/classes', {
          headers: {'Access-Control-Allow-Origin': '*'},
        })
        .then((response) => {
          this.references = response.data;
        });
    await this.$axios
        .get('/api/v1/classes/latest', {
          headers: {'Access-Control-Allow-Origin': '*'},
        })
        .then((response) => {
          this.classlist = response.data.rows;
        });
    this.isLoading = false;
  },
  created() {
    if (process.client) {
      window.addEventListener('scroll', this.handleScroll);
    }
  },
  destroyed() {
    if (process.client) {
      window.removeEventListener('scroll', this.handleScroll);
    }
  },
  methods: {
    handleScroll() {
      const tutorialsElement = document.getElementById('tutorials');
      const stylesElement = document.getElementById('styles');
      const levelsElement = document.getElementById('levels');
      const affixElement = document.getElementById('affix');
      const tutorialPosTop =
        tutorialsElement.getBoundingClientRect().top + window.scrollY - 20;
      const stylesPosTop =
        stylesElement.getBoundingClientRect().top + window.scrollY - 20;
      const levelsPosTop =
        levelsElement.getBoundingClientRect().top + window.scrollY - 20;
      const levelsPosBottom =
        levelsElement.getBoundingClientRect().top +
        window.scrollY +
        levelsElement.clientHeight;

      if (window.scrollY > tutorialPosTop && window.scrollY < stylesPosTop) {
        document.getElementById('anchor-tutorials').classList.add('selected');
        document.getElementById('anchor-styles').classList.remove('selected');
        document.getElementById('anchor-levels').classList.remove('selected');
      } else if (
        window.scrollY > stylesPosTop &&
        window.scrollY < levelsPosTop
      ) {
        document.getElementById('anchor-tutorials').classList.remove('selected');
        document.getElementById('anchor-styles').classList.add('selected');
        document.getElementById('anchor-levels').classList.remove('selected');
      } else if (
        window.scrollY > levelsPosTop &&
        window.scrollY <= levelsPosBottom
      ) {
        document.getElementById('anchor-tutorials').classList.remove('selected');
        document.getElementById('anchor-styles').classList.remove('selected');
        document.getElementById('anchor-levels').classList.add('selected');
      } else {
        document.getElementById('anchor-tutorials').classList.remove('selected');
        document.getElementById('anchor-styles').classList.remove('selected');
        document.getElementById('anchor-levels').classList.remove('selected');
      }

      if (
        window.scrollY > tutorialPosTop &&
        affixElement.clientHeight + affixElement.offsetTop <=
          levelsElement.getBoundingClientRect().bottom
      ) {
        affixElement.classList.add('sticky');
        affixElement.classList.remove('sticky-bottom');
      }

      if (
        affixElement.clientHeight +
          affixElement.getBoundingClientRect().top +
          window.scrollY >
        levelsPosBottom + 20
      ) {
        affixElement.classList.remove('sticky');
        affixElement.classList.add('sticky-bottom');
      }

      if (affixElement.getBoundingClientRect().top > 20) {
        affixElement.classList.add('sticky');
        affixElement.classList.remove('sticky-bottom');
      }

      if (window.scrollY <= tutorialPosTop) {
        affixElement.classList.remove('sticky');
        affixElement.classList.remove('sticky-bottom');
      }
    },
    scrollToTutorials() {
      VueScrollTo.scrollTo('#tutorials');
    },
    scrollToStyles() {
      VueScrollTo.scrollTo('#styles');
    },
    scrollToLevels() {
      VueScrollTo.scrollTo('#levels');
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
      link: [{rel: 'canonical', href: 'https://www.danceplug.com/classes'}],
    };
  },
};
</script>
