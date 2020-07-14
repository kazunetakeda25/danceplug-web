<template>
  <div>
    <client-only>
      <loading :active.sync="isLoading" color="#13B4D1" full-page="true" />
      <go-top />
    </client-only>
    <AppHeader class="plum-ruby">Submit a Dance Audition Or Job</AppHeader>
    <section>
      <script src="https://static.airtable.com/js/embed/embed_snippet_v1.js" />
      <iframe
        class="airtable-embed airtable-dynamic-height"
        src="https://airtable.com/embed/shrGRWl8zlKWXxKfj?backgroundColor=green"
        frameborder="0"
        onmousewheel
        width="100%"
        height="2936"
        style="background: transparent; border: none;"
      />
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      metaItems: {
        site: 'DancePlug',
        title: 'Submit a Dance Audition Or Job | DancePlug',
        description:
          'Looking for dancers for an upcoming project, gig or to fill an opening in your company? Or in need of a teacher, administrative help, or a choreographer?',
        coverImage:
          'https://cdn.danceplug.com/sites/default/files/dplogo_og.png',
      },
    };
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
        {rel: 'canonical', href: 'https://www.danceplug.com/list/audition'},
      ],
    };
  },
};
</script>
