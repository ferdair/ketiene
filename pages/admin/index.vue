<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-autocomplete
          :items="ciudades"
          item-text="nombreCiu"
          item-value="id_ciudad"
          label="Ciudad"
          v-model="ciudad"
          outlined
          @change="filtrarComercios"
        ></v-autocomplete>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" md="2">
        <v-card
          dark
          class="text-center"
          to="/restaurante/nuevo"
          nuxt
          color="#f45c04"
        >
          <v-icon x-large dark>mdi-plus</v-icon><br />
          Nuevo Restaurante
        </v-card>
      </v-col>
      <v-col cols="4" md="2" v-for="com in comercios" :key="com.idComercio">
        <v-card
          :to="`/restaurante/${com.idComercio}`"
          class="d-flex justify-center"
        >
          <v-sheet>
            <v-img
              :src="com.imagenLogo"
              contain
              max-width="120"
              class="rounded-t-lg"
            ></v-img>

            <v-sheet-footer class="text-caption rounded-lg"
              ><p class="text-truncate">
                {{ com.nombre }}
              </p></v-sheet-footer
            >
          </v-sheet>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <h3>Estadísticas Generales</h3>
    </v-row>
    <v-row>
      <v-col cols="12" md="10">
        <v-row>
          <v-col cols="6">
            <v-icon color="#f45c04">mdi-chart-bar</v-icon>
            <span class="orange--text text--darken-4">{{
              this.vistasMenu
            }}</span
            >&nbsp;Vistas al menú
            <v-sparkline
              label-size="15"
              line-width="10"
              height="200"
              type="bar"
              :value="[0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0]"
              :labels="vistasLabels"
              :gradient="['#F25C05']"
            >
            </v-sparkline>
          </v-col>
          <v-col cols="6">
            <v-icon color="#f45c04">mdi-chart-bar</v-icon>
            <span class="orange--text text--darken-4">{{ this.clicksWs }}</span
            >&nbsp;Clics en Compra por WhatsApp
            <v-sparkline
              label-size="15"
              line-width="10"
              height="200"
              type="bar"
              :value="[0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0]"
              :labels="clicksLabels"
              :gradient="['#F25C05']"
            >
            </v-sparkline
          ></v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="2">
        <v-row>
          <v-col cols="6" md="12">
            <v-card class="ma-0" outlined>
              <div class="d-flex flex-no-wrap justify-space-between pa-0">
                <v-col cols="3" align-self="center">
                  <v-icon color="#f45c04" x-large>
                    mdi-silverware-variant
                  </v-icon>
                </v-col>
                <v-col cols="9">
                  <div class="display-3 text-center">1</div>
                  <br />
                  <div class="text-center">Categorías</div>
                </v-col>
              </div>
            </v-card>
          </v-col>
          <v-col cols="6" md="12">
            <v-card class="ma-0" outlined>
              <div class="d-flex flex-no-wrap justify-space-between pa-0">
                <v-col cols="3" align-self="center">
                  <v-icon color="#f45c04" x-large> mdi-menu </v-icon>
                </v-col>
                <v-col cols="9">
                  <div class="display-3 text-center">1</div>
                  <br />
                  <div class="text-center">Categorías</div>
                </v-col>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import env from '@/config/env'
export default {
  name: 'prue',
  layout: 'adminPage',
  data: () => ({
    ciudades: [],
    ciudad: null,
    comercios: [],
  }),
  components: {
    // A simple helper component
    VSheetFooter: {
      functional: true,

      render(h, { children }) {
        return h(
          'v-sheet',
          {
            props: {
              color: 'rgba(0, 0, 0, .36)',
              dark: true,
              height: 20,
            },
          },
          children
        )
      },
    },
  },
  async mounted() {
    const aux = await axios.get(env.endpoint + '/auxiliarComercio.php')
    this.ciudades = aux.data.data[0].ciudad

    const com = await axios.get(
      env.endpoint + '/datosRestaurante.php?ciudad=205'
    )
    /*
    com.data.data.forEach((element) => {
      element.sucursales.forEach((element2) => {
        element2.nombre = element.nombre
        element2.idComercio = element.idComercio
        this.auxComercios.splice(0, 0, element2)
      })
    }) */

    this.comercios = com.data.data.filter((c) => c.estado !== 3)
    this.ciudad = 205
    /*
    this.ciudad = 205
    this.filtrarComercios()
    console.warn(com.data.data) */
  },
  methods: {
    async filtrarComercios() {
      const c = await axios.get(
        env.endpoint + '/datosRestaurante.php?ciudad=' + this.ciudad
      )

      if (c.data.data !== false) {
        this.comercios = c.data.data.filter((d) => d.estado !== 3)
      } else {
        this.comercios = []
      }
    },
  },
}
</script>

<style></style>
