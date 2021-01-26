<template>
  <v-container>
    <v-row>
      <v-col>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row justify="start" align="start">
            <v-col cols="12" md="8">
              <v-text-field
                label="Título"
                outlined
                v-model="titulo"
                :rules="tituloRules"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                label="Fecha Inicio"
                outlined
                v-model="fechaInicio"
                :rules="fechaInicioRules"
                type="date"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="8">
              <v-text-field
                label="Subtítulo"
                outlined
                v-model="subtitulo"
              ></v-text-field>
            </v-col>
            <!-- <v-col cols="12" md="4">
              <v-text-field
                label="Fecha Fin"
                outlined
                v-model="fechaFin"
                :rules="fechaFinRules"
                type="date"
              ></v-text-field>
            </v-col> -->
            <v-col cols="12" md="4">
              <v-text-field
                label="Fecha Fin"
                outlined
                v-model="fechaFin"
                :rules="fechaFinRules"
                type="date"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-autocomplete
                :items="provincias"
                item-text="nombreProv"
                item-value="id_provincia"
                label="Provincia"
                v-model="provincia"
                outlined
                @change="setCiudades"
                :rules="provinciaRules"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="4">
              <v-autocomplete
                :items="ciudades"
                item-text="nombreCiu"
                item-value="id_ciudad"
                label="Ciudad"
                v-model="ciudad"
                outlined
                @change="setRestaurantes"
                :rules="ciudadRules"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <h3>Resturantes Habilitados (Máximo 15 restaurantes)</h3>
            </v-col>
            <v-col cols="12">
              <v-row align="center" justify="center">
                <v-col
                  cols="3"
                  md="2"
                  v-for="res in auxRestaurantes"
                  :key="res.idComercio"
                >
                  <v-card>
                    <div class="d-flex flex-no-wrap justify-start">
                      <div class="align-self-center">
                        <v-checkbox
                          v-model="restaurantes"
                          :value="res.idComercio"
                          color="#f45c04"
                        ></v-checkbox>
                      </div>

                      <v-avatar tile size="100">
                        <v-img :src="res.imagenLogo" contain></v-img>
                      </v-avatar>
                    </div>
                    <v-card-actions>
                      {{ res.nombre }}
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-btn color="#f45c04" dark @click="registrar"
                ><v-icon>mdi-new-box</v-icon> Registrar Evento</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import env from '@/config/env'
export default {
  name: 'nuevoEventoDeportivo',
  layout: 'adminPage',
  data: () => ({
    titulo: '',
    tituloRules: [(v) => !!v || 'El título es requerido'],
    fechaInicio: '',
    fechaInicioRules: [(v) => !!v || 'La fecha de inicio es requerida'],
    subtitulo: '',
    // subtituloRules: [(v) => !!v || 'El subtítulo es requerido'],
    fechaFin: '',
    fechaFinRules: [(v) => !!v || 'La fecha de fin es requerida'],
    provincias: [],
    provincia: null,
    provinciaRules: [(v) => !!v || 'Provincia es requerido'],
    ciudades: [],
    ciudad: null,
    ciudadRules: [(v) => !!v || 'Ciudad es requerido'],
    auxCiudades: [],
    auxRestaurantes: [],
    restaurantes: [],
    restaurantesRules: [(v) => !!v || 'Seleccione al menos un restaurante'],
    valid: true,
  }),
  async mounted() {
    // AUXILIAR
    const aux = await axios.get(env.endpoint + '/auxiliarComercio.php')

    this.provincias = aux.data.data[0].provincia

    // CIUDADES
    this.auxCiudades = aux.data.data[0].ciudad

    this.provincia = 23
    this.ciudad = 205
    this.setCiudades()
    this.setRestaurantes()
  },
  methods: {
    setCiudades() {
      this.ciudades = this.auxCiudades.filter(
        (e) => e.provincia === this.provincia
      )
    },
    async setRestaurantes() {
      const x = await axios.get(
        env.endpoint + '/datosRestaurante.php?ciudad=' + this.ciudad
      )

      this.auxRestaurantes = x.data.data
    },
    async registrar() {
      if (this.$refs.form.validate() && this.restaurantes.length !== 0) {
        const json = {
          titulo: this.titulo,
          subtitulo: this.subtitulo,
          fechaInicio: this.fechaInicio + ' 00:00:00',
          fechaFin: this.fechaFin + ' 00:00:00',
          idCiudad: this.ciudad,
          restaurantes: this.restaurantes,
        }

        const r = await axios.post(
          env.endpoint + '/eventosDeportivos.php',
          json
        )

        const boo = r.data.code === 200

        this.alertRegistrar(boo, r.data.message)
        this.$router.push({
          path: '/eventosdeportivos',
        })
      } else {
        alert('¡Llene correctamente los datos por favor!')
      }
    },
    alertRegistrar(respuesta, mensaje) {
      const ico = respuesta === true ? 'success' : 'error'
      this.$swal({ icon: ico, title: mensaje, confirmButtonColor: '#f45c04' })
    },
  },
}
</script>

<style></style>
