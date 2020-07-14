<template>
  <div class="overflow-auto mt-3 d-flex justify-content-center pager">
    <jw-pagination
      :items="loadedNodes"
      :styles="customStyles"
      :labels="customLabels"
      :page-size="customPageSize"
      @changePage="onChangePage"
    ></jw-pagination>
  </div>
</template>

<script>
const customStyles = {
  a: {
    'font-size': '14px',
    'display': 'flex',
    'justify-content': 'center',
    'align-items': 'center',
  },
};

const customPageSize = 6;

const customLabels = {
  first: '«',
  last: '»',
  previous: '‹',
  next: '›',
};

const customItems = [];

export default {
  name: 'JWPager',
  props: {
    loadedNodes: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      customStyles,
      customLabels,
      customPageSize,
    };
  },
  methods: {
    onChangePage(pageOfItems) {},
  },
};
</script>
