<template>
  <v-container>
    <div v-for="com in comercios" :key="com.idComercio">
      <v-img :src="com.imagenLogo"></v-img>
    </div>
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
    ciudad: [],
    comercios: [],
  }),
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
    /* 
    this.ciudad = 205
    this.filtrarComercios()
    console.warn(com.data.data) */
  },
  methods: {
    /* filtrarComercios() {
      this.comercios = this.auxComercios.filter(
        (i) => Number(i.idCiudad) === this.ciudad
      )
    }, */
  },
}
</script>

<style></style>
