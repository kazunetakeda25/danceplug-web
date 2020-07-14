<template>
  <section class="container mw-holder">
    <div class="content-holder" :class="date ? 'has-hero' : ''">
      <div v-if="video || video2 || image" class="media-top">
        <div v-if="video" class="embed-responsive embed-responsive-16by9">
          <iframe
            :src="video"
            width="100%"
            height="100%"
            frameborder="0"
            scrolling="auto"
            :title="title"
            allowfullscreen
          />
        </div>
        <div
          v-else-if="video2"
          class="embed-responsive embed-responsive-16by9"
          v-html="video2"
        />
        <div v-else-if="image" class="img-fluid" v-html="image" />
      </div>
      <div v-if="noHeader == 'false'">
        <header v-if="title" class="content-info">
          <p v-if="credit" class="footnote light credit" v-html="credit" />
          <h1 v-if="title" class="title" v-html="title"></h1>
          <div class="d-flex">
            <small
              v-if="
                level ||
                  style_block ||
                  type ||
                  tax ||
                  date ||
                  author ||
                  readtime ||
                  calltype
              "
              class="d-block"
            >
              <div class="tax">
                <span v-if="tax" v-html="tax" />
                <span v-if="level" v-html="level" />
                <span v-if="style_block" v-html="style_block" />
                <span v-if="type" v-html="type" />
              </div>
              <div
                v-if="author || date || readtime || calltype"
                class="footnote"
              >
                <span v-if="author">by {{ author }} •</span>
                <span v-if="date">{{ date }}</span>
                <span v-if="calltype">{{ calltype }}</span>
                <span v-if="readtime">• {{ readtime }} mins read</span>
              </div>
            </small>
            <div v-if="enableSumo == 'true'" class="ml-auto">
              <a
                data-sumome-share-id="2cfc2f6e-67bf-455d-b62e-1a72f17a8863"
              ></a>
            </div>
          </div>
        </header>
      </div>
      <div class="row article-content">
        <article class="col-sm-10 col-md-8 offset-sm-1 offset-md-2">
          <slot></slot>
          <slot name="authorInfo"></slot>
        </article>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'PageHolder',
  props: [
    'flag',
    'credit',
    'title',
    'tax',
    'level',
    'style_block', // style is a reserved attribute and cannot be used as component prop
    'type',
    'calltype',
    'share',
    'author',
    'date',
    'readtime',
    'video',
    'video2',
    'image',
    'enableSumo',
    'noHeader',
  ],
  mounted() {
    if (this.enableSumo == 'true') {
      const sumomeScript = document.createElement('script');
      sumomeScript.setAttribute('src', '//load.sumome.com/');
      sumomeScript.setAttribute(
          'data-sumo-site-id',
          '924d007d86ad3d832e6ed750e604969dcc2b2bc093e5e29cb6f24aaa7853d340',
      );
      sumomeScript.async = true;
      document.body.appendChild(sumomeScript);
    }
  },
};
</script>
