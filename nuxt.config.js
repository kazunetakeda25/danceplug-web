export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      {
        charset: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        property: 'og:site_name',
        content: 'DancePlug',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'rating',
        content: 'general',
      },
      {
        property: 'rights',
        content: 'DancePlug, Inc.',
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
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
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#000000',
  },
  /*
   ** Global CSS
   */
  css: ['@/assets/scss/dp.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    {
      src: '@/plugins/global.js',
    },
    {
      src: '@/plugins/client.js',
      ssr: false,
    },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    'bootstrap-vue/nuxt',
    'nuxt-webfontloader',
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/sitemap',
    'nuxt-vue-multiselect',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    proxy: true,
    retry: {
      retries: 3,
    },
  },
  proxy: {
    '/api/v1/': {
      target: 'https://dev.cms.danceplug.com/api/v1/',
      pathRewrite: {'^/api/v1/': ''},
      changeOrigin: true,
    },
    '/RESTI/': {
      target: 'https://dev.cms.danceplug.com/',
      pathRewrite: {'^/RESTI/': ''},
      changeOrigin: true,
    },
    '/RESTII/': {
      target: 'https://dev.cms.danceplug.com:2700/',
      pathRewrite: {'^/RESTII/': ''},
      changeOrigin: true,
    },
  },
  webfontloader: {
    custom: {
      families: [
        'Raleway        :n1,i3,i4,n6',
        'Roboto+Slab    :n2,n3,n4,n5',
        'Roboto         :n4,i4',
      ],
      urls: [
        'https://fonts.googleapis.com/css2?family=Raleway:wght@100;600&ital,wght@1,300;1,400&display=swap',
        'https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@200;300;400;500&display=swap',
        'https://fonts.googleapis.com/css2?family=Roboto:ital@0;1&display=swap',
      ],
    },
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
};
