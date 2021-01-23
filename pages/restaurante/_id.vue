<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="mx-auto" outlined>
          <div class="d-flex flex-no-wrap justify-space-between pa-5">
            <v-col
              cols="4"
              md="1"
              class="grey lighten-3 rounded-lg"
              align-self="center"
            >
              <v-img :src="comercio.imagenLogo"></v-img>
              <!-- <v-icon x-large color="grey darken-1"> mdi-store </v-icon> -->
            </v-col>
            <v-col cols="8" md="11">
              <h3>{{ comercio.nombre }}</h3>
              <p>ketiene.com/{{ comercio.identificador }}</p>
            </v-col>
          </div>
        </v-card>
      </v-col>
      <v-col cols="6" md="2">
        <v-card class="ma-0" outlined>
          <div class="d-flex flex-no-wrap justify-space-between pa-0">
            <v-col cols="3" align-self="center">
              <v-icon color="#f45c04" x-large> mdi-menu </v-icon>
            </v-col>
            <v-col cols="9">
              <div class="display-3 text-center">
                {{ comercio.numeroCategorias }}
              </div>
              <br />
              <div class="text-center">Categorías</div>
            </v-col>
          </div>
        </v-card>
      </v-col>

      <v-col cols="6" md="2">
        <v-card class="ma-0" outlined>
          <div class="d-flex flex-no-wrap justify-space-between pa-0">
            <v-col cols="3" align-self="center">
              <v-icon x-large color="#f45c04"> mdi-silverware-variant </v-icon>
            </v-col>
            <v-col cols="9">
              <div class="display-3 text-center">
                {{ comercio.numeroProductos }}
              </div>
              <br />
              <div class="text-center">Items</div>
            </v-col>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="3" class="text-center">
        <v-col cols="12" md="12" align-self="center">
          <v-card>
            <qrcode-vue :value="link" size="200" level="H"></qrcode-vue><br />
            Vista Previa
          </v-card>
        </v-col>
        <v-col cols="12" md="12">
          <v-card to="/admin">
            <v-icon size="100"> mdi-account-cog </v-icon><br />
            Volver al Inicio Admin
          </v-card>
        </v-col>
      </v-col>
      <v-col cols="12" md="9">
        <v-row>
          <h1>Primeros pasos</h1>
          <v-subheader> Configure su tienda en pocos minutos </v-subheader>
        </v-row>
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
              :value="vistasValores"
              :labels="vistasLabels"
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
              :value="clicksValores"
              :labels="clicksLabels"
            >
            </v-sparkline
          ></v-col>
          <v-col cols="6" md="3">
            <v-card
              class="ma-0 text-center pt-3 rounded-lg"
              elevation="5"
              :to="`/restaurante/editar/${this.$route.params.id}`"
            >
              <v-icon x-large>mdi-pencil</v-icon>
              <br />
              <v-subheader> Editar diseño e información </v-subheader>
            </v-card>
          </v-col>
          <v-col cols="6" md="3">
            <v-card
              class="ma-0 text-center pt-3 rounded-lg"
              elevation="5"
              :to="`/menu/categorias/${this.$route.params.id}`"
            >
              <v-icon x-large>mdi-menu</v-icon>
              <br />
              <v-subheader> Agregar Categorías </v-subheader>
            </v-card>
          </v-col>
          <v-col cols="6" md="3">
            <v-card
              class="ma-0 text-center pt-3 rounded-lg"
              elevation="5"
              :to="`/menu/items/${this.$route.params.id}`"
            >
              <v-icon x-large>mdi-silverware-variant</v-icon>
              <br />
              <v-subheader> Agregar Items </v-subheader>
            </v-card>
          </v-col>
          <v-col cols="6" md="3">
            <v-card
              class="ma-0 text-center pt-3 rounded-lg"
              elevation="5"
              :to="`/restaurante/qr/${this.$route.params.id}`"
            >
              <v-icon x-large>mdi-qrcode</v-icon>
              <br />
              <v-subheader> Imprimir QR </v-subheader>
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
import QrcodeVue from 'qrcode.vue'

export default {
  name: 'Restaurante',
  layout: 'restaurantePage',
  data: () => ({
    comercio: [],
    vistasMenu: 0,
    vistasValores: [],
    vistasLabels: [],
    clicksWs: 0,
    clicksValores: [],
    clicksLabels: [],
    link: '',
    id: 0,
  }),
  async mounted() {
    this.id = this.$route.params.id

    const com = await axios.get(
      env.endpoint + '/datosRestaurante.php?id=' + this.id
    )
    this.comercio = com.data.data[0]

    this.link = 'ketiene.com/' + com.data.data[0].identificador

    this.vistasMenu =
      this.comercio.estVistas[0] +
      this.comercio.estVistas[1] +
      this.comercio.estVistas[2]

    this.vistasValores = this.comercio.estVistas
    this.vistasLabels = this.comercio.meses

    this.clicksWs =
      this.comercio.estWhatsapp[0] +
      this.comercio.estWhatsapp[1] +
      this.comercio.estWhatsapp[2]

    this.clicksValores = this.comercio.estWhatsapp
    this.clicksLabels = this.comercio.meses
  },
  components: {
    QrcodeVue,
  },
}
</script>

<style scoped>
.main {
  background: lightgrey;
}
</style>
