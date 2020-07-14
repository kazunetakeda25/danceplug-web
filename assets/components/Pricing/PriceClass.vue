<template>
  <div id="class-pricing" class="prices container mt-8">
    <h2 v-if="sectionTitle" class="display-2 text-center">{{ sectionTitle }}</h2>
    <b-row class="justify-content-md-center">
      <b-col v-for="item in priceItems" :key="item.id" lg="4" md="6">
        <div class="card text-center">
          <div class="card-header">
            <h2>{{ item.title }}</h2>
          </div>
          <div class="card-body">
            <div class="price">
              <span class="text-lg d-inline-block">{{ item.price }}</span>
              <span v-if="item.recur">/month</span>
              <small class="d-block">{{ item.period }}</small>
              <small v-if="item.save" class="d-block text-primary">save {{ item.save }}</small>
            </div>
          </div>
          <div class="card-footer">
            <p>{{ item.footnote }}</p>
            <b-button @click="item.subscribe" :variant="item.btnColor">{{ item.btnTitle }}</b-button>
          </div>
        </div>
      </b-col>
      <Bars v-if="barDirection" :class="barDirection" class="bars-ruby" />
    </b-row>
    <small class="footnote">All pricing shown in USD</small>
    <client-only>
      <div style="display: none;">
        <stripe-checkout
          ref="checkoutRef"
          pk="pk_test_51GwBzoL4rMja94A4woODgyEGW3kohIBvx8gaCiIa8PjGbLXIKPYnqrxDMi6MMQDeilKxgMa0ZYrg7sb2fpX8nXRq00Z16yCVI3"
          :mode="mode"
          :lineItems="lineItems"
          :successUrl="successUrl"
          :cancelUrl="cancelUrl"
          :sessionId="sessionId"
        />
      </div>
    </client-only>
  </div>
</template>

<script>
import Bars from '@/assets/components/Bars';
const qs = require('qs');

export default {
  name: 'PriceClass',
  components: {
    Bars,
  },
  props: ['sectionTitle', 'barDirection'],
  data() {
    return {
      metadata: [],
      sessionId: '',
      mode: 'subscription',
      lineItems: [],
      successUrl: '',
      cancelUrl: '',
      priceItems: [
        {
          title: 'The Enthusiast',
          price: '$25',
          period: 'billed monthly',
          footnote: 'recurring monthly fee',
          btnTitle: 'Let\'s Dance',
          btnColor: 'secondary',
          recur: true,
          subscribe: this.enthusiastPlan,
        },
        {
          title: 'The Professional',
          price: '$20',
          period: 'billed annually',
          save: '20%',
          footnote: 'recurring annual fee',
          btnTitle: 'Let\'s Dance',
          btnColor: 'primarypink',
          recur: true,
          subscribe: this.professionalPlan,
        },
        {
          title: 'The Apprentice',
          price: '$80',
          period: '3 months prepaid',
          save: '6.50%',
          footnote: 'no cancelation needed',
          btnTitle: 'Let\'s Dance',
          btnColor: 'secondary',
          subscribe: this.apprenticePlan,
        },
      ],
    };
  },
  methods: {
    enthusiastPlan() {
      const config = {
        method: 'POST',
        url: '/RESTII/api/v1/stripe/create-checkout-session',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify({
          'priceId': 'price_1H4ikbL4rMja94A4t7utqIzb',
          'metadata[planName]': 'The Enthusiast Plan',
        }),
      };
      this.checkout(config);
    },
    professionalPlan() {
      const config = {
        method: 'POST',
        url: '/RESTII/api/v1/stripe/create-checkout-session',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify({
          'priceId': 'price_1H4ioML4rMja94A42bNNHtLY',
          'metadata[planName]': 'The Professional Plan',
        }),
      };
      this.checkout(config);
    },
    apprenticePlan() {
      const config = {
        method: 'POST',
        url: '/RESTII/api/v1/stripe/create-checkout-session',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify({
          'priceId': 'price_1H4IwSL4rMja94A4Dnh3LMmp',
          'metadata[planName]': 'The Apprentice Plan',
        }),
      };
      this.checkout(config);
    },
    checkout(config) {
      const self = this;
      this.$axios(config)
          .then(function(response) {
            if (response.data.session) {
              self.sessionId = response.data.session.id;
              self.metadata = response.data.session.metadata;
              self.mode = response.data.session.mode;
              self.lineItems = response.data.session.line_items;
              self.successUrl = response.data.session.success_url;
              self.cancelUrl = response.data.session.cancel_url;
              self.$refs.checkoutRef.redirectToCheckout();
            }
          })
          .catch(function(error) {
            console.log(error);
          });
    },
  },
};
</script>
