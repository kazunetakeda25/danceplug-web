<template>
  <b-navbar
    id="main-navbar"
    toggleable="lg"
    type="light"
    class="shadow-lg border-bottom"
  >
    <div class="container">
      <b-navbar-brand to="/">
        <img
          class="dp-logo"
          src="https://cdn.danceplug.com/sites/default/files/dplogo20.svg"
          alt="DancePlug"
          width="250"
          height="20"
        />
      </b-navbar-brand>

      <b-navbar-toggle v-b-toggle.sidebar-menu target="sidebar-menu">
        <Icon name="icon-menu" />
      </b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/classes">Classes</b-nav-item>
          <b-nav-item to="/auditions">Auditions</b-nav-item>
          <b-nav-item-dropdown text="News & Advice">
            <b-dropdown-item to="/articles">Articles</b-dropdown-item>
            <b-dropdown-item to="/news">News</b-dropdown-item>
            <b-dropdown-item to="/blogs">Blogs</b-dropdown-item>
            <b-dropdown-item to="/interviews">Interviews</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown text="Community">
            <b-dropdown-item to="/events">Events</b-dropdown-item>
            <b-dropdown-item to="/videos">Videos</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item to="/pricing">Pricing</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item to="https://dev.app.danceplug.com/login">Log in</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </div>
  </b-navbar>
</template>

<script>
export default {
  name: 'AppHeader',
};
</script>
