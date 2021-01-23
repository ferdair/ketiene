<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="9">
        <h3>Para Cumpleañeros</h3>
        <v-subheader class="orange--text text--darken-4">
          Adicional a tu pedido, presentando tu cédula de identidad
        </v-subheader>
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

    <v-row
      v-for="promo in promosCumpleanos"
      :key="promo.idCumple"
      justify="start"
    >
      <v-col cols="12">
        <v-card outlined>
          <v-row justify="start" align="center" class="px-4">
            <v-icon>mdi-menu</v-icon>
            <v-avatar class="profile" color="grey" size="50" tile>
              <v-img :src="promo.imagen"></v-img>
            </v-avatar>
            <!-- <v-img :src="prodC.imagen" max-height="50" contain></v-img> -->
            <h3>{{ promo.tituloCumple }}</h3>
            &nbsp;
            <span class="light-green accent-4 white--text text-h6"
              >&nbsp;{{ promo.etiquetaCumple }}&nbsp;</span
            >
            <v-spacer></v-spacer>
            <v-btn icon @click="alertEliminar(promo.idCumple)"
              ><v-icon>mdi-delete</v-icon></v-btn
            >
            <v-btn icon @click="editarPromo(promo.idCumple)"
              ><v-icon>mdi-pencil</v-icon></v-btn
            >
            <v-switch
              v-model="promo.estado"
              color="#f45c04"
              dark
              @change="cambiarEstadoPromo(promo.idCumple, promo.estado)"
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
            Nueva Promo Cumpleañeros</v-card-title
          >
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="8">
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="tituloPromo"
                        :rules="tituloPromoRules"
                        label="Título"
                        required
                        outlined
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12"
                      ><v-text-field
                        v-model="etiquetaPromo"
                        :rules="etiquetaPromoRules"
                        label="Etiqueta"
                        required
                        outlined
                        hint="Ejemplo: Gratis"
                      ></v-text-field
                    ></v-col>
                    <v-col cols="12">
                      <v-textarea
                        outlined
                        label="Descripción"
                        auto-grow
                        v-model="descripcionPromo"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="4">
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
                  <div>
                    *Se Recomienda que las imagen es tengan una relación de
                    aspecto de 1.2817 Ejemplo 1281.7 x 1000 414 x 323
                  </div>
                </v-col>
              </v-row>
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

              <!-- <v-text-field
                prefix="$"
                v-model="precioItem"
                :rules="precioItemRules"
                label="Precio del Item"
                required
                outlined
                type="number"
              ></v-text-field> -->

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
            <v-btn text @click="cancelar()"> Cancelar </v-btn>
            <v-btn
              color="#f45c04"
              @click="subirImagen()"
              dark
              v-if="editando === false"
            >
              Guardar
            </v-btn>
            <v-btn
              color="#f45c04"
              @click="guardarEditado()"
              v-if="editando === true"
              dark
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
  name: 'Cumpleaneros',
  layout: 'restaurantePage',
  data: () => ({
    promosCumpleanos: [],
    tituloPromo: null,
    tituloPromoRules: [(v) => !!v || 'Título es requerido'],
    etiquetaPromo: null,
    etiquetaPromoRules: [(v) => !!v || 'Etiqueta es requerido'],
    imagenPromo: null,
    imagenPromoRules: [(v) => !!v || 'Imágen es requerido'],
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
    imagenUrl: '',
  }),
  mounted() {
    this.idC = this.$route.params.id
    /*
    const c = await axios.get(env.endpoint + '/promoCumple.php?id=' + this.idC)

    if (c.data.data === false) {
      this.promosCumpleanos = []
    } else {
      this.promosCumpleanos = c.data.data.filter((a) => a.estado !== 3)
      this.
    } */
    this.actualizarPromo()
  },
  methods: {
    async cambiarEstadoPromo(ide, es) {
      const x = es === false ? '2' : '1'
      const e = await axios.patch(env.endpoint + '/promoCumple.php', {
        id: ide,
        campo: 'estado',
        dato: Number(x),
      })
      this.alertCambio(e.data.data, e.data.message)
      this.actualizarPromo()
      /*  this.error = true
      this.error_msg = e.data.message */
    },
    alertEliminar(ide) {
      this.$swal({
        title: '¿Desea Eliminar la Promo?',
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
          const e = await axios.patch(env.endpoint + '/promoCumple.php', js)

          this.alertCambio(e.data.data, e.data.message)
          this.actualizarPromo()
        }
      })
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
          .child(`cumpleanos/${nombre}`)

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
                  idComercio: this.idC,
                  etiquetaCumple: this.etiquetaPromo,
                  descripcion: this.descripcionPromo,
                  imagen: downloadURL,
                  tituloCumple: this.tituloPromo,
                }

                const r = await axios.post(
                  env.endpoint + '/promoCumple.php',
                  js
                )

                this.alertCambio(r.data.data, r.data.message)

                this.vaciarPromo()
                this.cancelar()
                this.actualizarPromo()

                /*  this.error = true
                this.error_msg = r.data.message */

                /* 

                this.cancelar()

                // Promos del comercio
                const p = await axios.get(
                  env.endpoint + '/promoCumple.php?id=' + this.idC
                )
                this.promosCumpleanos = p.data.data.filter(
                  (a) => a.estado !== 2
                ) */
              })
          }
        )
      }
    },
    async actualizarPromo() {
      const id = this.$route.params.id
      let data = (await axios.get(env.endpoint + '/promoCumple.php?id=' + id))
        .data.data

      if (data === false) {
        this.promosCumpleanos = []
      } else {
        data = data.filter((a) => a.estado !== 3)
        data = data.map((a) => {
          const es = a.estado !== 2
          a.estado = es
          return a
        })

        this.promosCumpleanos = data
      }
    },
    alertCambio(respuesta, mensaje) {
      const ico = respuesta === true ? 'success' : 'error'
      this.$swal({ icon: ico, title: mensaje })
    },
    editarPromo(id) {
      this.dialog = true
      this.editando = true
      const pr = this.promosCumpleanos.filter((a) => a.idCumple === id)[0]
      this.idPr = pr.idCumple
      this.auxEstado = pr.estado

      this.etiquetaPromo = pr.etiquetaCumple
      this.descripcionPromo = pr.descripcion
      this.imagenPromo = new File([''], 'filename')
      this.imagenUrl = pr.imagen
      this.auxImg = pr.imagen
      this.tituloPromo = pr.tituloCumple
    },
    vaciarPromo() {
      this.idPr = null
      this.auxEstado = false
      this.etiquetaPromo = ''
      this.descripcionPromo = ''
      this.imagenPromo = null
      this.imagenUrl = ''
      this.auxImg = ''
      this.tituloPromo = ''
    },
    cancelar() {
      this.dialog = false
      this.editando = false
      this.vaciarPromo()
    },
    eliminarPromo() {
      /*  const p = await axios.patch(env.endpoint + '/promoCumple.php', {
        id: this.idPr,
        campo: 'estado',
        dato: 2,
      })

      this.error = true
      this.error_msg = p.data.message
      this.cancelar() */
      this.alertEliminar(this.idPr)
      this.cancelar()
      this.actualizarPromo()
    },
    async guardarEditado() {
      if (this.$refs.form.validate()) {
        if (this.imagenPromo.name !== 'filename') {
          const nombre = Date.now()
          /*eslint-disable */
          var storageRef = this.$fireModule
            .storage()
            .ref()
            .child(`cumpleanos/${nombre}`)

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

                  const pe = {
                    idCumple: this.idPr,
                    idComercio: Number(this.idC),
                    etiquetaCumple: this.etiquetaPromo,
                    descripcion: this.descripcionPromo,
                    imagen: downloadURL,
                    tituloCumple: this.tituloPromo,
                    estado: this.auxEstado,
                  }

                  const r = await axios.put(
                    env.endpoint + '/promoCumple.php',
                    pe
                  )

                  this.alertCambio(r.data.data, r.data.message)

                  this.vaciarPromo()
                  this.cancelar()
                  this.actualizarPromo()
                  /*  this.error = true
                  this.error_msg = r.data.message

                  this.cancelar()

                  // Promos del comercio
                  const p = await axios.get(
                    env.endpoint + '/promoCumple.php?id=' + this.idC
                  )
                  this.promosCumpleanos = p.data.data.filter(
                    (a) => a.estado !== 2
                  ) */
                })
            }
          )
        } else {
          const pe = {
            idCumple: this.idPr,
            idComercio: this.idC,
            etiquetaCumple: this.etiquetaPromo,
            descripcion: this.descripcionPromo,
            imagen: this.auxImg,
            tituloCumple: this.tituloPromo,
            estado: this.auxEstado,
          }

          const r = await axios.put(env.endpoint + '/promoCumple.php', pe)

          this.alertCambio(r.data.data, r.data.message)

          this.vaciarPromo()
          this.cancelar()
          this.actualizarPromo()

          /* this.error = true
          this.error_msg = r.data.message

          this.cancelar()

          // Promos del comercio
          const p = await axios.get(
            env.endpoint + '/promoCumple.php?id=' + this.idC
          )
          this.promosCumpleanos = p.data.data.filter((a) => a.estado !== 2) */
        }
      }
    },
  },
}
</script>

<style></style>
