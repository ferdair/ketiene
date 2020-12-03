<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-row justify="start" align="center">
          <v-col cols="12">
            <!--  <v-autocomplete
              label="Ciudad"
              outlined
              v-model="ciudad"
              @change="filtrarComercios"
              :items="ciudades"
              
              item-text="nombreCiu"
              item-value="id_ciudad"
            >
            </v-autocomplete> -->
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
          <v-col cols="2" md="1">
            <v-card class="text-center" to="/restaurante/nuevo" nuxt>
              <v-icon x-large color="blue-gray lighten-2">mdi-plus</v-icon>
            </v-card>

            <!-- <v-btn color="blue-grey lighten-5" x-large>
                    <v-icon color="blue-grey lighten-2">mdi-plus</v-icon>
                  </v-btn> -->
          </v-col>

          <v-col
            cols="2"
            md="2"
            v-for="comercio in comercios"
            :key="comercio.idComercio"
          >
            <!-- <v-btn color="blue-grey lighten-5" x-large>
                    <v-icon color="blue-grey lighten-2">mdi-home</v-icon>
                  </v-btn> -->
            <v-card
              class="text-center"
              :to="`/restaurante/${comercio.idSucursales}`"
              nuxt
            >
              <v-sheet color="blue-gray lighten-3">
                <v-icon x-large color="blue-gray lighten-2">mdi-home</v-icon>
                <v-sheet-footer class="text-caption"
                  ><p class="text-truncate">
                    {{ comercio.nombre }}
                  </p></v-sheet-footer
                >
              </v-sheet>
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
  name: 'Admin',
  layout: 'adminPage',
  components: {
    VSheetFooter: {
      functional: true,

      render(h, { children }) {
        return h(
          'v-sheet',
          {
            staticClass: 'pt-2 text-center align-center justify-center d-flex',
            props: {
              color: 'rgba(0, 0, 0, .2)',
              dark: true,
            },
          },
          children
        )
      },
    },
  },
  data: () => ({
    ciudades: [],
    ciudad: null,
    auxComercios: [],
    comercios: null,
  }),
  async mounted() {
    const aux = await axios.get(env.endpoint + '/auxiliarComercio.php')
    this.ciudades = aux.data.data[0].ciudad

    const com = await axios.get(env.endpoint + '/datosComercio.php')

    com.data.data.forEach((element) => {
      element.sucursales.forEach((element2) => {
        element2.nombre = element.nombre
        element2.idComercio = element.idComercio
        this.auxComercios.splice(0, 0, element2)
      })
    })
  },
  methods: {
    filtrarComercios() {
      this.comercios = this.auxComercios.filter(
        (i) => Number(i.idCiudad) === this.ciudad
      )
    },
  },
}
</script>

<style></style>
