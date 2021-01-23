<template>
  <v-container>
    <v-row>
      <v-col>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row justify="start" align="start">
            <v-col cols="12" md="8">
              <v-textarea
                outlined
                name="input-7-4"
                label="¿Quiénes Somos"
                v-model="descripcion"
                :rules="descripcionRules"
              ></v-textarea></v-col
            ><v-col cols="12" md="8">
              <v-text-field
                label="¿Necesitas ayuda?"
                outlined
                v-model="ayuda"
                :rules="ayudaRules"
              ></v-text-field
            ></v-col>
            <v-col cols="12" md="8">
              <v-text-field
                label="Teléfono de Soporte y Contacto"
                outlined
                v-model="telefono"
                :rules="telefonoRules"
              ></v-text-field
            ></v-col>
            <v-col cols="12">
              <v-btn color="#f45c04" dark @click="guardar"
                ><v-icon>mdi-arrow-expand-up</v-icon> Guardar Datos</v-btn
              >
            </v-col></v-row
          ></v-form
        ></v-col
      ></v-row
    >
  </v-container>
</template>

<script>
import axios from 'axios'
import env from '@/config/env'
export default {
  name: 'nuevaPublicidad',
  layout: 'adminPage',
  data: () => ({
    descripcion: '',
    descripcionRules: [(v) => !!v || 'La descripción es requerida'],
    ayuda: '',
    ayudaRules: [(v) => !!v || 'La ayuda es requerida'],
    telefono: '',
    telefonoRules: [(v) => !!v || 'El telefono es requerido'],
  }),
  async mounted() {
    const req = await axios.get(env.endpoint + '/datosGenerales.php')
    this.descripcion = req.data.data[0].about
    this.ayuda = req.data.data[0].ayuda
    this.telefono = req.data.data[0].telefono
  },
  methods: {
    async guardar() {
      if (this.$refs.form.validate()) {
        const idev = Number(this.$route.params.id)
        // const es = this.estado === false ? '2' : '1'

        const json = {
          id: idev,
          about: this.descripcion,
          telefono: this.telefono,
          ayuda: this.ayuda,
          facebook: 'www.fb.com/ketiene',
          instagram: 'www.instagram.com/ketiene/',
        }

        const r = await axios.put(env.endpoint + '/generales.php', json)

        const boo = r.data.code === 200

        this.alertRegistrar(boo, r.data.message)
        /*  this.$router.push({
          path: '/eventosdeportivos',
        }) */
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
