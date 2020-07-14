<template>
  <footer id="main-footer">
    <div class="container">
      <div class="flexme">
        <ul class="list-inline">
          <li
            v-for="item in socialItems"
            :key="item.id"
            class="list-inline-item"
          >
            <IconSocial
              :link="item.link"
              :title="item.follow"
              :name="item.name"
              size="lg"
            />
          </li>
        </ul>
        <a
          target="_blank"
          href="https://danceplug.zendesk.com/"
          class="btn btn-primary ml-auto"
          >Contact Us</a
        >
      </div>
      <nav class="navbar">
        <ul id="footer-rights" class="list-inline">
          <li class="list-inline-item">
            <a href="/" title="DancePlug">
              <img
                class="dp-logo"
                src="https://cdn.danceplug.com/sites/default/files/dplogo20_wh.svg"
                alt="DancePlug"
                width="250"
                height="20"
              />
            </a>
          </li>
          <li class="list-inline-item">
            DancePlug, Inc. &#169; {{ new Date().getFullYear() }} All Rights
            Reserved.
          </li>
        </ul>
        <div class="d-none d-sm-none d-md-none d-lg-block d-xl-block">
          <b-nav class="ml-auto">
            <b-nav-item to="/about">About</b-nav-item>
            <b-nav-item to="/blogs">Blog</b-nav-item>
            <b-nav-item to="/sitemap">Sitemap</b-nav-item>
            <b-nav-item to="/privacy-policy">Privacy Policy</b-nav-item>
            <b-nav-item to="/terms-service">Terms of Service</b-nav-item>
          </b-nav>
        </div>
      </nav>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  data() {
    return {
      socialItems: [
        {
          name: 'icon-instagram',
          link: 'https://instagram.com/danceplug',
          follow: 'Follow us on Instagram',
        },
        {
          name: 'icon-twitter',
          link: 'https://twitter.com/danceplug',
          follow: 'Follow us on Twitter',
        },
        {
          name: 'icon-youtube',
          link: 'https://goo.gl/inDvSV',
          follow: 'Subscribe to our Youtube Channel',
        },
        {
          name: 'icon-facebook',
          link: 'https://facebook.com/danceplug',
          follow: 'Like us on Facebook',
        },
        {
          name: 'icon-linkedin',
          link: 'https://linkedin.com/company/danceplug',
          follow: 'Join us on LinkedIn',
        },
      ],
    };
  },
};
</script>
