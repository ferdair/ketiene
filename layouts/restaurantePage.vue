<template>
  <div>
    <v-app id="inspire">
      <v-navigation-drawer v-model="drawer" app dark>
        <!--  -->
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title"> KeTiene Admin </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense nav>
          <v-list-item to="/admin" nuxt link>
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Panel</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group
            prepend-icon="mdi-store"
            no-action
            active-class="deep-orange darken-1"
            color="white"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Tienda</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item :to="`/restaurante/${this.$route.params.id}`">
              <v-list-item-content>
                <v-list-item-title>Inicio</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="`/restaurante/editar/${this.$route.params.id}`">
              <v-list-item-content>
                <v-list-item-title>Configuración</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="`/restaurante/qr/${this.$route.params.id}`">
              <v-list-item-content>
                <v-list-item-title>Generar QR</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              :to="`/restaurante/sucursales/${this.$route.params.id}`"
            >
              <v-list-item-content>
                <v-list-item-title>Sucursales</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>

          <v-list-group
            prepend-icon="mdi-silverware"
            no-action
            active-class="deep-orange darken-1"
            color="white"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Menú</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item :to="`/menu/categorias/${this.$route.params.id}`">
              <v-list-item-content>
                <v-list-item-title>Categorías</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="`/menu/items/${this.$route.params.id}`">
              <v-list-item-content>
                <v-list-item-title>Items</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
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
  name: 'RestaurantePage',

  data: () => ({
    param: null,
    drawer: false,
    user: {
      initials: '',
      fullName: '',
      email: '',
    },
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
  mounted() {
    this.param = Number(this.$route.params.id)
  },
}
</script>

<style></style>
