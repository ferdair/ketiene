import colors from 'vuetify/es5/util/colors'

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - ketiene',
    title: 'ketiene',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/ketiene-color.svg' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [{ src: '~/plugins/google-maps', ssr: true }],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: 'AIzaSyCKGFLI5LTHN590hjGpgPKQeo6sxfh8-PE',
          authDomain: 'ketiene-2a5cf.firebaseapp.com',
          databaseURL: 'https://ketiene-2a5cf.firebaseio.com',
          projectId: 'ketiene-2a5cf',
          storageBucket: 'ketiene-2a5cf.appspot.com',
          messagingSenderId: '518781685146',
          appId: '1:518781685146:web:e33f643c313b6d9ea6fe23',
          measurementId: 'G-94ZE1H76F3',
        },
        services: {
          storage: true,
        },
      },
    ],
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: 'https://qooworklab.com/ketiene/apis',
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: { transpile: [/^vue2-google-maps($|\/)/] },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/login.php',
            method: 'post',
            propertyName: 'data.data[0].jwt',
          },
          logout: false,
          user: {
            url: '/login.php?id=PutaHermano',
            method: 'get',
            propertyName: 'data.data[0]',
          },
          /*           user: false,
           */
        },
      },
    },
    redirect: {
      login: '/login',
      logout: '/',
      callback: '/login',
      home: '/admin',
    },
  },
}
