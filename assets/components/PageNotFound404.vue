<template>
  <div>
    <AppHeader class="iris-yonder pt-5">
      404
      <Intro class="mt-3">Page Not Found.</Intro>
    </AppHeader>
    <section class="container">
      <div class="text-center">
        <h2>We can't find what you're looking for</h2>
        <ul class="list-unstyled">
          <li class="none">Here are some groovy links instead:</li>
          <li class="none">&nbsp;</li>
          <li><b-link to="/">Home</b-link></li>
          <li><b-link to="/classes">Classes</b-link></li>
          <li><b-link to="/auditions">Auditions/Casting Calls</b-link></li>
          <li><b-link to="/news">Dance News</b-link></li>
          <li><b-link to="/events">Dance Events</b-link></li>
          <li><b-link to="/videos">Dance Videos</b-link></li>
          <li><b-link to="/pricing">Pricing</b-link></li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'PageNotFound404',
};
</script>
