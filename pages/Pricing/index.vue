<template>
  <div>
    <client-only>
      <loading :active.sync="isLoading" color="#13B4D1" full-page="true" />
      <go-top />
    </client-only>
    <AppHeader class="plum-ruby">Pricing</AppHeader>
    <Intro
      >Select the right online dance class and audition listing plans. Instantly
      gain access to unlimited classes to learn at your own pace and find the
      latest casting calls from around the globe.</Intro
    >

    <section id="price-options" class="container mb-10">
      <b-tabs content-class="mt-5">
        <b-tab title="Classes" active>
          <PriceClass />
        </b-tab>
        <b-tab title="Auditions">
          <PriceAudition />
        </b-tab>
      </b-tabs>
    </section>
    <Cols2
      color="bg-plum"
      image="//dev.cms.danceplug.com/sites/default/files/styles/1920/public/images/misc/dancer-jazz.jpg?itok=QftLdLVk"
    >
      <h2 slot="text" class="display-2">
        <span class="first">You May</span>
        <span class="last">Wonder</span>
      </h2>
    </Cols2>
    <Faq :faqs="loadedFaqs" />
    <Quote :quotes="references" class="quotes" />
  </div>
</template>

<script>
import PriceClass from '@/assets/components/Pricing/PriceClass';
import PriceAudition from '@/assets/components/Pricing/PriceAudition';
import Cols2 from '@/assets/components/Cols/Cols2';
import Quote from '@/assets/components/Quote';
import Faq from '@/assets/components/Faq';
export default {
  components: {
    PriceClass,
    PriceAudition,
    Cols2,
    Faq,
    Quote,
  },
  data() {
    return {
      isLoading: false,
      references: {},
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
      metaItems: {
        site: 'DancePlug',
        title: 'Choose The Service You Need | DancePlug',
        description:
          'Select the right online dance class and audition listing plans. Instantly gain access to unlimited classes to learn at your own pace and find the latest casting calls from around the globe.',
        coverImage:
          'https://cdn.danceplug.com/sites/default/files/dplogo_og.png',
      },
    };
  },
  async mounted() {
    this.isLoading = true;
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
      link: [{rel: 'canonical', href: 'https://www.danceplug.com/pricing'}],
    };
  },
};
</script>
