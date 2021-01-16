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

    this.comercios = com.data.data
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
      this.comercios = c.data.data
    },
  },
}
</script>

<style></style>
