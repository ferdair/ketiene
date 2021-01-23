<template>
  <v-container>
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
export default { name: 'estadisticas', layout: 'adminPage', data: () => ({}) }
</script>

<style></style>
