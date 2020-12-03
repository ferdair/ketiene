<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="9">
        <h3 class="orange--text text--darken-4">Todo lo que puedas comer</h3>
        <!--  <v-subheader class="">
          Adicional a tu pedido, presentando tu cédula de identidad
        </v-subheader> -->
      </v-col>
      <v-col cols="12" md="3">
        <v-btn left rounded color="#f45c04" dark @click="dialog = true">
          <v-icon large left>mdi-plus</v-icon>
          Agregar Promo
        </v-btn>
      </v-col>
    </v-row>
    <!-- <v-row class="orange darken-4">
      <v-col cols="12">
        <v-autocomplete
          v-model="categoria"
          label="Categoría"
          required
          outlined
          :items="categoriasC"
          item-text="nombreTipoProducto"
          item-value="idTipoProductoComercio"
          dark
          @change="cambiarProductos"
        >
        </v-autocomplete>
      </v-col>
    </v-row> -->

    <v-row v-for="promo in todoComer" :key="promo.idTodoComer" justify="start">
      <v-col cols="12">
        <v-card outlined>
          <v-row justify="start" align="center" class="px-4">
            <v-icon>mdi-menu</v-icon>
            <v-avatar class="profile" color="grey" size="50" tile>
              <v-img :src="promo.imagen"></v-img>
            </v-avatar>
            <!-- <v-img :src="prodC.imagen" max-height="50" contain></v-img> -->
            <!-- <h3>{{ promo.tituloCumple }}</h3>
            &nbsp; -->
            <span class="blue-grey--text text-h6">
              <h3>&nbsp;&nbsp;&nbsp;${{ promo.precio }}</h3></span
            >
            <v-spacer></v-spacer>
            <v-btn icon @click="editarPromo(promo.idTodoComer)"
              ><v-icon>mdi-pencil</v-icon></v-btn
            >
            <v-switch
              v-model="promo.estado"
              color="#f45c04"
              @change="cambiarEstadoPromo(promo.idTodoComer, promo.estado)"
            >
            </v-switch>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="550">
        <v-card>
          <v-card-title class="headline">
            Nueva Promo Todo lo que puedas Comer</v-card-title
          >
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <!--  <v-autocomplete
                v-model="categoriaNueva"
                :rules="categoriaNuevaRules"
                label="Categoría"
                required
                outlined
                :items="categoriasC"
                item-text="nombreTipoProducto"
                item-value="idTipoProducto"
              >
              </v-autocomplete> -->
              <!--  <v-text-field
                v-model="tituloPromo"
                :rules="tituloPromoRules"
                label="Título"
                required
                outlined
              ></v-text-field>
              <v-text-field
                v-model="etiquetaPromo"
                :rules="etiquetaPromoRules"
                label="Etiqueta"
                required
                outlined
                hint="Ejemplo: Gratis"
              ></v-text-field> -->
              <v-text-field
                prefix="$"
                v-model="precioPromo"
                :rules="precioPromoRules"
                label="Precio"
                required
                outlined
                type="number"
              ></v-text-field>
              <v-file-input
                accept="image/*"
                label="Logo"
                v-model="imagenPromo"
                @change="urlImagen"
                :clearable="false"
                outlined
                :rules="imagenPromoRules"
              ></v-file-input>
              <div class="d-flex justify-center">
                <v-icon v-if="imagenPromo === null">mdi-camera-plus</v-icon>
                <v-img
                  v-else
                  :src="imagenUrl"
                  max-height="150"
                  max-width="250"
                  contain
                >
                </v-img>
              </div>
              <!-- <v-autocomplete
                v-model="etiquetaItem"
                :rules="etiquetaItemRules"
                label="Etiqueta"
                required
                outlined
                :items="etiquetas"
                item-text="nombreEtiqueta"
                item-value="idEtiquetaProducto"
              >
              </v-autocomplete> -->
              <v-textarea
                outlined
                label="Descripción"
                auto-grow
                v-model="descripcionPromo"
              ></v-textarea>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red"
              text
              @click="eliminarPromo()"
              v-if="editando === true"
            >
              <v-icon left>mdi-delete</v-icon>
              Eliminar
            </v-btn>
            <v-btn color="green darken-1" text @click="cancelar()">
              Cancelar
            </v-btn>
            <v-btn
              color="#f45c04"
              @click="subirImagen()"
              v-if="editando === false"
            >
              Guardar
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              @click="guardarEditado()"
              v-if="editando === true"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog></v-row
    >
    <v-snackbar v-model="error" :multi-line="true">
      {{ error_msg }}

      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="error = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios'
import env from '@/config/env'

export default {
  name: 'TodoComer',
  layout: 'restaurantePage',
  data: () => ({
    todoComer: [],
    precioPromo: null,
    precioPromoRules: [(v) => !!v || 'Precio es requerido'],
    imagenPromo: null,
    imagenPromoRules: [(v) => !!v || 'Imágen es requerido'],
    imagenUrl: '',
    descripcionPromo: '',
    error: false,
    error_msg: '',
    dialog: false,
    valid: true,
    idC: null,
    editando: false,
    auxImg: '',
    auxEstado: false,
    idPr: null,
  }),
  async mounted() {
    this.idC = this.$route.params.id

    const c = await axios.get(env.endpoint + '/todoComer.php?id=' + this.idC)
    this.todoComer = c.data.data.filter((a) => a.estado !== 2)
  },
  methods: {
    async cambiarEstadoPromo(ide, es) {
      const e = await axios.patch(env.endpoint + '/todoComer.php', {
        id: ide,
        campo: 'estado',
        dato: es,
      })

      this.error = true
      this.error_msg = e.data.message
    },
    urlImagen() {
      if (this.imagenPromo) {
        this.imagenUrl = URL.createObjectURL(this.imagenPromo)
      } else {
        this.imagenPromo = new File([''], 'filename')
        this.imagenUrl = this.auxImg
      }
    },
    subirImagen() {
      if (this.$refs.form.validate()) {
        const nombre = Date.now()
        /*eslint-disable */
        var storageRef = this.$fireModule
          .storage()
          .ref()
          .child(`todocomer/${nombre}`)

        var uploadTask = storageRef.put(this.imagenPromo)
        /* eslint-enable */

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            /*eslint-disable */
            this.error = true
            this.error_msg = 'La carga está completa en un ' + progress + '%'
            // console.log('Upload is ' + progress + '% done')
            /* eslint-enable */
          },
          (error) => {
            /* this.error = true
          this.error_msg = JSON.stringify(error.message)

          */
            /*eslint-disable */
            this.error = true
            this.error_msg = error
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

                const js = {
                  descripcion: this.descripcionPromo,
                  idComercio: this.idC,
                  imagen: this.downloadURL,
                  precio: this.precioPromo,
                }

                const r = await axios.post(env.endpoint + '/todoComer.php', js)

                this.error = true
                this.error_msg = r.data.message

                this.cancelar()

                // Promos del comercio
                const p = await axios.get(
                  env.endpoint + '/todoComer.php?id=' + this.idC
                )
                this.todoComer = p.data.data.filter((a) => a.estado !== 2)
              })
          }
        )
      }
    },
    editarPromo(id) {
      this.dialog = true
      this.editando = true
      const pr = this.todoComer.filter((a) => a.idTodoComer === id)[0]
      this.idPr = pr.idTodoComer
      this.auxEstado = pr.estado

      this.descripcionPromo = pr.descripcion
      this.imagenPromo = new File([''], 'filename')
      this.imagenUrl = pr.imagen
      this.auxImg = pr.imagen
      this.precioPromo = pr.precio
    },
    vaciarPromo() {
      this.idPr = null
      this.auxEstado = false

      this.descripcionPromo = null
      this.precioPromo = null
      this.imagenPromo = null
      this.imagenUrl = ''
      this.auxImg = ''
    },
    cancelar() {
      this.dialog = false
      this.editando = false
      this.vaciarPromo()
    },
    async eliminarPromo() {
      const p = await axios.patch(env.endpoint + '/todoComer.php', {
        id: this.idPr,
        campo: 'estado',
        dato: 2,
      })

      this.error = true
      this.error_msg = p.data.message
      this.cancelar()
    },
    async guardarEditado() {
      if (this.$refs.form.validate()) {
        if (this.imagenPromo.name !== 'filename') {
          const nombre = Date.now()
          /*eslint-disable */
          var storageRef = this.$fireModule
            .storage()
            .ref()
            .child(`todocomer/${nombre}`)

          var uploadTask = storageRef.put(this.imagenPromo)
          /* eslint-enable */

          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              /*eslint-disable */
              this.error = true
              this.error_msg = 'La carga está completa en un ' + progress + '%'
              // console.log('Upload is ' + progress + '% done')
              /* eslint-enable */
            },
            (error) => {
              /* this.error = true
          this.error_msg = JSON.stringify(error.message)

          */
              /*eslint-disable */
              this.error = true
              this.error_msg = error
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

                  const e = this.auxEstado === true ? 1 : 0

                  const pe = {
                    idTodoComer: this.idPr,
                    observaciones: 'Sin Obs',
                    descripcion: this.descripcionPromo,
                    idComercio: this.idC,
                    estado: e,
                    imagen: downloadURL,
                    precio: this.precioPromo,
                  }

                  const r = await axios.put(env.endpoint + '/todoComer.php', pe)

                  this.error = true
                  this.error_msg = r.data.message

                  this.cancelar()

                  // Promos del comercio
                  const p = await axios.get(
                    env.endpoint + '/todoComer.php?id=' + this.idC
                  )
                  this.todoComer = p.data.data.filter((a) => a.estado !== 2)
                })
            }
          )
        } else {
          const pe = {
            idTodoComer: this.idPr,
            observaciones: 'Sin Obs',
            descripcion: this.descripcionPromo,
            idComercio: this.idC,
            estado: this.auxEstado,
            imagen: this.auxImg,
            precio: this.precioPromo,
          }

          const r = await axios.put(env.endpoint + '/todoComer.php', pe)

          this.error = true
          this.error_msg = r.data.message

          this.cancelar()

          // Promos del comercio
          const p = await axios.get(
            env.endpoint + '/todoComer.php?id=' + this.idC
          )
          this.todoComer = p.data.data.filter((a) => a.estado !== 2)
        }
      }
    },
  },
}
</script>

<style></style>
