<template>
  <section id="faq" class="plum-ruby">
    <b-container class="text-white">
      <b-row>
        <b-col lg="10">
          <div role="tablist" class="accordion-simple">
            <b-card
              v-for="item in faqs"
              :key="item.id"
              :fid="item.fid"
              no-body
              class="mb-1"
            >
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button v-b-toggle="'accordion-' + item.fid" block>
                  <h3 class="display-3">
                    {{ item.question }}
                  </h3>
                </b-button>
              </b-card-header>
              <b-collapse
                :id="'accordion-' + item.fid"
                accordion="my-accordion"
                role="tabpanel"
              >
                <b-card-body>
                  <b-card-text>
                    {{ item.answer }}
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
export default {
  name: 'Faq',
  props: {
    faqs: {
      type: Array,
      required: true,
    },
  },
};
</script>
