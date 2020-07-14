<template>
  <main id="main-container">
    <sidebar />
    <AppNav />
    <div id="main-content">
      <fade-transition origin="center" mode="out-in" :duration="300">
        <nuxt />
      </fade-transition>
    </div>
    <AppFooter />
  </main>
</template>

<script>
import {FadeTransition} from 'vue2-transitions';
import AppNav from '@/components/AppNav';
import Sidebar from '@/components/AppSidebar';
import AppFooter from '@/components/AppFooter';
export default {
  components: {
    AppNav,
    AppFooter,
    Sidebar,
    FadeTransition,
  },
  metaInfo: {
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {property: 'og:site_name', content: 'DancePlug'},
      {property: 'og:type', content: 'website'},
      {property: 'rating', content: 'general'},
      {property: 'rights', content: 'DancePlug, Inc.'},
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
    ],
    script: [
      {
        type: 'application/ld+json',
        json: {
          '@context': 'http://schema.org',
          '@type': 'Organization',
          '@graph': [
            {
              '@id': 'https://www.danceplug.com/',
              'name':
                'Online Dance Classes, Choreography & Dance Auditions | DancePlug',
              'description':
                'Take online dance classes, learn choreography and apply to the latest dance auditions across the globe. Join today, be inspired, and get booked.',
              'url': 'https://www.danceplug.com',
              '@type': 'WebPage',
            },
            {
              '@type': 'Organization',
              '@id': 'https://www.danceplug.com',
              'name': 'DancePlug',
              'telephone': '+1-800-664-5251',
              'contactPoint': {
                '@type': 'ContactPoint',
                'telephone': '+1-800-664-5251',
                'availableLanguage': 'English',
                'contactType': 'Customer Support',
                'email': 'info@danceplug.com',
              },
              'url': 'https://www.danceplug.com',
              'sameAs': [
                'https://instagram.com/danceplug',
                'https://facebook.com/danceplug',
                'https://youtube.com/user/danceplug',
                'https://twitter.com/danceplug',
                'https://linkedin.com/company/danceplug',
              ],
              'logo': {
                '@type': 'ImageObject',
                'url':
                  'https://cdn.danceplug.com/sites/default/files/logo_og.png',
                'width': '200',
                'height': '200',
              },
            },
          ],
        },
      },
    ],
  },
};
</script>
