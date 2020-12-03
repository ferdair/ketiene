<template>
  <div>
    <v-app id="inspire">
      <v-navigation-drawer v-model="drawer" app>
        <!--  -->
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title"> KeTiene Admin </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense nav>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            :to="item.path"
            :target="item.target"
            nuxt
            link
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar app>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <img
          class="mr-3"
          :src="require('@/static/ketiene-color.svg')"
          height="40"
        />
        <v-spacer></v-spacer>
        <v-menu bottom min-width="200px" rounded offset-y>
          <template v-slot:activator="{ on }">
            <v-btn icon x-large v-on="on">
              <v-avatar size="48" color="#f45c04">
                <v-icon dark> mdi-account-circle </v-icon>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-list-item-content class="justify-center">
              <div class="mx-auto text-center">
                <v-avatar color="#f45c04">
                  <v-icon dark> mdi-account-circle </v-icon>
                </v-avatar>
                <v-divider class="my-3"></v-divider>
                <v-btn depressed rounded text @click="logout">
                  Cerrar Sesión
                </v-btn>
              </div>
            </v-list-item-content>
          </v-card>
        </v-menu>
      </v-app-bar>

      <v-main>
        <Nuxt />
      </v-main>
      <Footer></Footer>
    </v-app>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Footer from '@/components/footer'

export default {
  data: () => ({
    name: 'AdminPage',
    drawer: false,
    user: {
      initials: '',
      fullName: '',
      email: '',
    },
    items: [
      {
        title: 'Inicio',
        icon: 'mdi-view-dashboard',
        path: '/admin',
        target: '_self',
      },
      /*  {
        title: 'Vitrinas',
        icon: 'mdi-store',
        path: '/comercio/vitrinas',
        target: '_self',
      },
      {
        title: 'Promociones',
        icon: 'mdi-piggy-bank',
        path: '/comercio/promociones',
        target: '_self',
      }, */
      /*  {
        title: 'Productos',
        icon: 'mdi-package-variant',
        path: '/comercio/productos',
      }, */
      /*  {
        title: 'Estadísticas',
        icon: 'mdi-chart-areaspline-variant',
        path: '/comercio/estadisticas',
        target: '_self',
      }, */
      /*  {
        title: 'Generador de catálogo',
        icon: 'mdi-pdf-box',
        path: 'http://cityemark.com/pdfTutorial/app/index.php?id=48',
        target: '_blank	',
      }, */
      /*  {
        title: 'Contactar a soporte',
        icon: 'mdi-help-box',
        path: '/comercio/soporte',
        target: '_self',
      }, */
    ],
    right: null,
  }),
  computed: {
    ...mapGetters(['getAux', 'loggedInUser']),
  },
  methods: {
    async logout() {
      await this.$auth.logout()
    },
  },
  components: {
    Footer,
  },
}
</script>

<style></style>
