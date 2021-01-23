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
                :rules="subtituloRules"
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
            <v-col cols="12" md="4">
              <v-switch v-model="estado" color="#f45c04"> </v-switch>
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
                    <v-card-actions class="text-center">
                      <v-spacer></v-spacer>{{ res.nombre }}
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-btn color="#f45c04" dark @click="guardar"
                ><v-icon>mdi-arrow-expand-up</v-icon> Guardar Datos</v-btn
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
    subtituloRules: [(v) => !!v || 'El subtítulo es requerido'],
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
    estado: true,
    estadoRules: [(v) => !!v || 'Seleccione el estado del restaurante'],
    valid: true,
  }),
  async mounted() {
    // AUXILIAR
    const aux = await axios.get(env.endpoint + '/auxiliarComercio.php')

    this.provincias = aux.data.data[0].provincia

    // CIUDADES
    this.auxCiudades = aux.data.data[0].ciudad

    // id del evento
    const idev = Number(this.$route.params.id)

    // EVENTOS DEPORTIVOS
    let eve = await axios.get(env.endpoint + '/eventosDeportivos.php')

    eve = eve.data.data.filter((a) => a.idEvento === idev)[0]

    this.titulo = eve.titulo
    this.subtitulo = eve.subtitulo

    this.fechaInicio = eve.fechaInicio.split(' ', 1)
    this.fechaFin = eve.fechaFin.split(' ', 1)
    this.ciudad = eve.idCiudad
    this.provincia = this.auxCiudades.filter(
      (e) => Number(e.id_ciudad) === Number(this.ciudad)
    )[0].provincia
    this.estado = eve.estado !== 2

    this.setCiudades()
    this.setRestaurantes()
    this.restaurantes = eve.restaurantes.map((a) => a.idComercio)
  },
  methods: {
    setCiudades() {
      this.ciudades = this.auxCiudades.filter(
        (e) => e.provincia === this.provincia
      )
    },
    async setRestaurantes() {
      this.restaurantes = []
      const x = await axios.get(
        env.endpoint + '/datosRestaurante.php?ciudad=' + this.ciudad
      )

      this.auxRestaurantes = x.data.data
    },
    async guardar() {
      if (this.$refs.form.validate() && this.restaurantes.length !== 0) {
        const idev = Number(this.$route.params.id)
        const es = this.estado === false ? '2' : '1'

        const json = {
          id: idev,
          titulo: this.titulo,
          subtitulo: this.subtitulo,
          fechaInicio: this.fechaInicio + ' 00:00:01',
          fechaFin: this.fechaFin + ' 00:00:01',
          idCiudad: this.ciudad,
          restaurantes: this.restaurantes,
          estado: Number(es),
        }

        const r = await axios.put(env.endpoint + '/eventosDeportivos.php', json)

        const boo = r.data.code === 200

        this.alertRegistrar(boo, r.data.message)
        this.$router.push({
          path: '/eventosdeportivos',
        })
      } else {
        alert('Seleccione al menos un restaurante!')
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
