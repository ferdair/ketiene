<template>
  <v-container>
    <v-row>
      <v-col>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row justify="start" align="start">
            <v-col cols="12" md="5">
              <v-file-input
                accept="image/*"
                v-model="imagenPublicidad"
                @change="urlImagen"
                :clearable="false"
                outlined
              ></v-file-input>
              <div class="d-flex justify-center">
                <v-icon v-if="imagenPublicidad === null"
                  >mdi-camera-plus</v-icon
                >
                <v-img
                  v-else
                  :src="imagenUrl"
                  max-height="150"
                  max-width="250"
                  contain
                >
                </v-img>
              </div>
            </v-col>
            <v-col cols="12" md="8">
              <v-text-field
                label="Url del link de la publicidad"
                outlined
                v-model="link"
                placeholder="Si no tiene dejar en blanco"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-btn color="#f45c04" dark @click="registrar"
                ><v-icon>mdi-new-box</v-icon> Guardar Datos
              </v-btn>
            </v-col>
          </v-row></v-form
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
    valid: true,
    imagenPublicidad: null,
    imagenUrl: '',
    link: '',
    aux: '',
  }),
  async mounted() {
    const idp = Number(this.$route.params.id)
    const x = await axios.get(env.endpoint + '/publicidadFrases.php?id=' + idp)

    this.imagenUrl = x.data.data[0].imagen
    this.aux = x.data.data[0].imagen
    this.imagenPublicidad = new File([''], 'filename')
  },
  methods: {
    urlImagen() {
      if (this.imagenPublicidad) {
        this.imagenUrl = URL.createObjectURL(this.imagenPublicidad)
      } else {
        this.imagenPublicidad = new File([''], 'filename')
        this.imagenUrl = this.aux
      }
    },
    async registrar() {
      if (this.imagenPublicidad.name !== 'filename') {
        const nombre = Date.now()
        /*eslint-disable */
        var storageRef = this.$fireModule
          .storage()
          .ref()
          .child(`publicidades/${nombre}`)

        var uploadTask = storageRef.put(this.imagenPublicidad)
        /* eslint-enable */

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            /*eslint-disable */

            console.log('Upload is ' + progress + '% done')
            /* eslint-enable */
          },
          (error) => {
            /* this.error = true
          this.error_msg = JSON.stringify(error.message)

          */
            /*eslint-disable */
            alert(error)

            // console.log(error)
            /* eslint-enable */
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref
              .getDownloadURL()
              .then(async (downloadURL) => {
                /*eslint-disable */
                // console.log('File available at', downloadURL)
                // console.log(downloadURL)
                /* eslint-enable */
                //            this.picture = downloadURL
                const ide = Number(this.$route.params.id)
                const js = {
                  id: ide,
                  imagen: downloadURL,
                  link: '',
                  estado: 1,
                }

                const r = await axios.put(
                  env.endpoint + '/publicidadFrases.php',
                  js
                )

                const boo = r.data.code === 200

                this.alertRegistrar(boo, r.data.message)
                this.$router.push({
                  path: '/publicidadyfrases',
                })
              })
          }
        )
      } else {
        const ide = Number(this.$route.params.id)

        const js = {
          id: ide,
          imagen: this.link,
          link: '',
          estado: 1,
        }
        const r = await axios.put(env.endpoint + '/publicidadFrases.php', js)
        const boo = r.data.code === 200

        this.alertRegistrar(boo, r.data.message)
        this.$router.push({
          path: '/publicidadyfrases',
        })
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
