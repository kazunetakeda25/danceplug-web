<template>
  <b-sidebar
    id="sidebar-menu"
    aria-label="DancePlug sidebar navigation"
    shadow
    backdrop
    title="DancePlug"
  >
    <div class="d-flex align-items-center">
      <b-navbar-nav>
        <b-nav-item class="nav-classes" to="/classes">Classes</b-nav-item>
        <b-nav-item class="nav-auditions" to="/auditions">Auditions</b-nav-item>
        <b-nav-item-dropdown class="nav-articles" no-caret>
          <template slot="button-content">
            <span class="">News & Advice</span>
            <Icon class="float-right" name="icon-more-vert" />
          </template>
          <b-dropdown-item to="/articles">Articles</b-dropdown-item>
          <b-dropdown-item to="/news">News</b-dropdown-item>
          <b-dropdown-item to="/blogs">Blogs</b-dropdown-item>
          <b-dropdown-item to="/interviews">Interviews</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown class="nav-community" no-caret>
          <template slot="button-content">
            Community
            <Icon class="float-right" name="icon-more-vert" />
          </template>
          <b-dropdown-item to="/events">Events</b-dropdown-item>
          <b-dropdown-item to="/videos">Videos</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item class="nav-pricing" to="/pricing">Pricing</b-nav-item>
      </b-navbar-nav>
    </div>

    <template v-slot:footer>
      <div class="d-flex align-items-center">
        <b-navbar-nav>
          <b-nav-item class="nav-login" to="https://dev.app.danceplug.com/login">Log in</b-nav-item>
          <b-nav-item class="nav-privacy" to="/privacy-policy">Privacy Policy</b-nav-item>
          <b-nav-item class="nav-terms" to="/terms-service">Terms of Service</b-nav-item>
          <li class="nav-item nav-support">
            <a
              class="nav-link"
              href="https://danceplug.zendesk.com/"
              target="_blank"
            >
              Support
            </a>
          </li>
        </b-navbar-nav>
      </div>
    </template>
  </b-sidebar>
</template>

<script>
export default {
  name: 'AppSidebar',
};
</script>
