<template>
  <v-container>
    <v-row> <h1>Generar QR</h1> </v-row>
    <v-row>
      <v-col cols="6">
        <!-- <h2 class="gray">Vista Previa</h2>
        <qrcode-vue :value="link" size="300" level="H"></qrcode-vue> -->
        <v-card class="text-center bg-border-radius">
          <div class="grey darken-3">
            <span class="white--text display-1">Vista previa</span>
          </div>
          <h2>¡La carta por favor!</h2>
          <qrcode-vue :value="link" size="300" level="H"></qrcode-vue>
          <p>
            Escanea el QR con tu cámara o en <strong>ketiene.com</strong> y mira
            <strong>la carta en tu celular</strong>
          </p>
        </v-card>
      </v-col>
      <v-col cols="6">
        <h3>Imprimir QR genérico</h3>
        <p>
          Puede colocar este QR en cualquier lugar donde no necesite uno de los
          de abajo
        </p>
        <v-btn color="#f45c04" dark> Descargar </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import env from '@/config/env'

import QrcodeVue from 'qrcode.vue'

export default {
  name: 'qr',
  layout: 'restaurantePage',
  data: () => ({
    id: 0,
    link: '',
  }),
  components: {
    QrcodeVue,
  },
  async mounted() {
    this.id = this.$route.params.id

    const com = await axios.get(
      env.endpoint + '/datosRestaurante.php?id=' + this.id
    )
    /*     this.comercio = com.data.data[0]
     */
    this.link = 'ketiene.com/' + com.data.data[0].identificador
  },
}
</script>

<style scoped></style>
