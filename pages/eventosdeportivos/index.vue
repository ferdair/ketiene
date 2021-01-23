<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="9">
        <h3>Eventos Deportivos</h3>
        <!-- <v-subheader>
          Las categorías son las secciones de su menú, por ejemplo: Entradas,
          Hamburguesas, Postres...|
        </v-subheader> -->
      </v-col>
      <v-col cols="12" md="3">
        <v-btn left rounded color="#f45c04" dark to="/eventosdeportivos/nuevo">
          <v-icon large left>mdi-plus</v-icon>
          Agregar Evento
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="vacio === true" justify="center">
      <v-col cols="12" md="5">
        <v-img :src="require('@/static/noEventos.png')" contain> </v-img>
      </v-col>
    </v-row>
    <v-row v-for="evento in eventos" :key="evento.idEvento">
      <v-col cols="12">
        <v-card outlined>
          <v-row justify="start" align="center" class="px-4">
            <!-- <v-icon>mdi-menu</v-icon>
            <h3>{{ evento.titulo }}</h3>
            <br />{{ evento.subtitulo }}
            <v-spacer></v-spacer>
            <v-btn icon><v-icon>mdi-pencil</v-icon></v-btn>
            <v-switch
              v-model="evento.estado"
              @change="cambiarEstadoEv(evento.idEvento, evento.estado)"
              color="#f45c04"
            >
            </v-switch> -->
            <v-col cols="1">
              <v-icon>mdi-menu</v-icon>
            </v-col>
            <v-col cols="7" class="pa-0 ma-0">
              <v-col class="pa-0 ma-0">
                <h3>{{ evento.titulo }}</h3>
              </v-col>
              <v-col class="pa-0 ma-0">
                &nbsp;<span class="font-weight-light">
                  {{ evento.subtitulo }}</span
                >
              </v-col>
            </v-col>
            <v-col cols="2" class="pa-0 ma-0">
              <v-col class="pa-0 ma-0">
                <span class="font-weight-black">Inicio:</span>
                {{ evento.fechaInicio }}
              </v-col>
              <v-col class="pa-0 ma-0">
                <span class="font-weight-black">Fin:</span>
                {{ evento.fechaFin }}
              </v-col>
            </v-col>
            <v-col cols="2" class="pa-0 ma-0">
              <v-row align="center">
                <v-btn icon @click="alertEliminar(evento.idEvento)"
                  ><v-icon>mdi-delete</v-icon></v-btn
                >
                <v-btn icon :to="`/eventosdeportivos/editar/${evento.idEvento}`"
                  ><v-icon>mdi-pencil</v-icon></v-btn
                >
                <v-switch
                  v-model="evento.estado"
                  @change="cambiarEstadoEv(evento.idEvento, evento.estado)"
                  color="#f45c04"
                >
                </v-switch>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import env from '@/config/env'
export default {
  name: 'eventosdeportivos',
  layout: 'adminPage',
  data: () => ({
    vacio: false,
    eventos: [],
  }),
  mounted() {
    this.actualizarEventos()
  },
  methods: {
    async cambiarEstadoEv(ide, es) {
      const x = es === false ? '2' : '1'

      const js = {
        id: ide,
        campo: 'estado',
        dato: Number(x),
      }
      const e = await axios.patch(env.endpoint + '/eventosDeportivos.php', js)

      this.alertCambio(e.data.data, e.data.message)
      this.actualizarEventos()
    },
    alertCambio(respuesta, mensaje) {
      const ico = respuesta === true ? 'success' : 'error'
      this.$swal({ icon: ico, title: mensaje })
    },
    async actualizarEventos() {
      let data = (await axios.get(env.endpoint + '/eventosDeportivos.php')).data
        .data

      if (data === false) {
        this.vacio = true
        this.eventos = []
      } else {
        data = data.map((a) => {
          const es = a.estado !== 2
          a.estado = es

          const fi = a.fechaInicio.split(' ', 1)
          a.fechaInicio = fi[0].replace(
            /^(\d{4})-(\d{2})-(\d{2})$/g,
            '$3/$2/$1'
          )

          const ff = a.fechaFin.split(' ', 1)
          a.fechaFin = ff[0].replace(/^(\d{4})-(\d{2})-(\d{2})$/g, '$3/$2/$1')
          return a
        })

        this.eventos = data
      }
    },
    alertEliminar(ide) {
      this.$swal({
        title: '¿Desea Eliminar el Evento Deportivo?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#F25C05',
        cancelButtonColor: '#383838',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => {
        if (result.isConfirmed) {
          /* this.$swal('Deleted!', 'Your file has been deleted.', 'success') */
          const js = {
            id: ide,
            campo: 'estado',
            dato: 3,
          }
          const e = await axios.patch(
            env.endpoint + '/eventosDeportivos.php',
            js
          )

          this.alertCambio(e.data.data, e.data.message)
          this.actualizarEventos()
        }
      })
    },
  },
}
</script>

<style></style>
