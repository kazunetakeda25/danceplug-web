import Vue from 'vue';
import Loading from 'vue-loading-overlay';
import GoTop from '@inotom/vue-go-top';
import {StripeCheckout} from 'vue-stripe-checkout';

Vue.component('loading', Loading);
Vue.component('go-top', GoTop);
Vue.component('stripe-checkout', StripeCheckout);
