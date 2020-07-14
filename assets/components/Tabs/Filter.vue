<template>
  <section class="container">
    <b-row align-h="end">
      <b-col md="6" lg="4" class="my-3">
        <div style="position: relative">
          <b-link
            class="tags-basic"
            style="float: right"
            @click="isFilterHidden = !isFilterHidden"
            >Filter</b-link
          >
          <Card
            v-if="!isFilterHidden"
            no-body
            class="cpreview"
            style="position: absolute; z-index: 10; width: 100%; margin-top: 43px;"
          >
            <b-card-body>
              <b-input
                v-model="keywords"
                placeholder="Title"
                class="mb-3"
              ></b-input>
              <multiselect
                v-model="selectedCategories"
                :options="loadedCategories"
                :multiple="true"
                placeholder="Category"
                track-by="category"
                label="category"
              >
                <span slot="noResult">Oops! No category found.</span>
              </multiselect>
            </b-card-body>
            <b-card-footer>
              <b-button
                type="submit"
                variant="primary btn-filter-search"
                @click="search"
                >Search</b-button
              >
            </b-card-footer>
          </Card>
        </div>
      </b-col>
    </b-row>
  </section>
</template>

<script>
export default {
  name: 'Filter',
  props: [
    'isFilterHidden',
    'keywords',
    'selectedCategories',
    'loadedCategories',
    'search',
  ],
  watch: {
    pager() {},
  },
};
</script>
