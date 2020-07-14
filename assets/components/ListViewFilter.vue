<template>
  <section class="container">
    <b-row align-h="end">
      <b-col md="6" lg="4" class="my-3">
        <div class="filter">
          <b-link
            class="filter-dropdown"
            @click="data.isFilterHidden = !data.isFilterHidden"
            >Filter</b-link
          >
          <Card v-if="!data.isFilterHidden" no-body class="card-filter">
            <b-card-body>
              <b-input
                v-model="data.keyword"
                placeholder="Title"
                class="mb-3"
              ></b-input>
              <multiselect
                v-model="data.categories"
                :options="data.totalCategoryList"
                :multiple="true"
                placeholder="Select a category"
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
  name: 'ListViewFilter',
  props: ['data', 'search'],
};
</script>
