<template>
  <div>
    <client-only>
      <loading :active.sync="isLoading" color="#13B4D1" full-page="true" />
      <go-top />
    </client-only>
    <AppHeader class="iris-yonder">Sign up for our Newsletter</AppHeader>
    <Intro
      >Get notified when the latest dance articles, online classes, auditions,
      and news are released on DancePlug. Stay informed!</Intro
    >
    <section class="container">
      <script src="https://www.google.com/recaptcha/api.js"></script>
      <div class="row">
        <div class="col-lg-4 col-md-6 ml-auto mr-auto text-center">
          <div class="card card-newsletter">
            <form
              class="form"
              action="https://sendy.danceplug.com/subscribe"
              method="POST"
              accept-charset="utf-8"
            >
              <div class="card-body">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <Icon name="icon-warning" color="dark" />
                    </span>
                  </div>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    class="form-control"
                    placeholder="Name"
                  />
                </div>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <Icon name="icon-warning" color="dark" />
                    </span>
                  </div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    class="form-control"
                    placeholder="Email"
                  />
                </div>
                <p class="g-recaptcha" data-sitekey="admin@danceplug.com"></p>
                <div class="d-none">
                  <label for="hp">HP</label>
                  <br />
                  <input id="hp" type="text" name="hp" />
                </div>
                <input
                  type="hidden"
                  name="list"
                  value="enUgKj27892ppRYvsuwzgubQ"
                />
                <input type="hidden" name="subform" value="yes" />
                <button
                  id="submit"
                  class="secondary"
                  type="submit"
                  name="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      metaItems: {
        site: 'DancePlug',
        title: 'Dance Newsletter | DancePlug',
        description:
          'Sign up for our newsletter, and we’ll send you the latest news, class releases, upcoming auditions, events, contests and special promos.',
        coverImage:
          'https://cdn.danceplug.com/sites/default/files/dplogo_og.png',
      },
    };
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
      link: [{rel: 'canonical', href: 'https://www.danceplug.com/newsletter'}],
    };
  },
};
</script>
