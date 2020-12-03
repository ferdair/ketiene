<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="9">
        <h3>Promociones</h3>
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

    <v-row
      v-for="promo in promociones"
      :key="promo.idPromocion"
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
            <!-- <h3>{{ promo.tituloCumple }}</h3>
            &nbsp; -->
            <span class="ma-0 pa-0"
              ><h3 class="pl-4">{{ promo.tituloPromocion }}</h3>
              <v-subheader>{{ promo.subtituloPromocion }}</v-subheader> </span
            ><v-spacer></v-spacer>
            <span class="white--text text-h6 orange darken-4">
              <h3>&nbsp;&nbsp;&nbsp;{{ promo.etiquetaPromocion }}</h3></span
            >
            <v-spacer></v-spacer>
            <v-btn icon @click="editarPromo(promo.idPromocion)"
              ><v-icon>mdi-pencil</v-icon></v-btn
            >
            <v-switch
              v-model="promo.estado"
              color="#f45c04"
              @change="cambiarEstadoPromo(promo.idPromocion, promo.estado)"
            >
            </v-switch>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="550">
        <v-card>
          <v-card-title class="headline"> Nueva Promoción</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="tituloPromo"
                :rules="tituloPromoRules"
                label="Título"
                required
                outlined
              ></v-text-field>

              <v-text-field
                v-model="subtituloPromo"
                :rules="subtituloPromoRules"
                label="Subtítulo"
                required
                outlined
              ></v-text-field>

              <!-- <v-text-field
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
              ></v-text-field>
              <v-text-field
                v-model="etiquetaPromo"
                :rules="etiquetaPromoRules"
                label="Etiqueta"
                required
                outlined
                prepend-inner-icon="mdi-tag"
              ></v-text-field>
              <!--  <v-autocomplete
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
              <div class="d-flex flex-wrap">
                <v-checkbox
                  v-model="lunesPromo"
                  label="Lunes"
                  color="#f45c04"
                ></v-checkbox
                >&nbsp;
                <v-checkbox
                  v-model="martesPromo"
                  label="Martes"
                  color="#f45c04"
                ></v-checkbox
                >&nbsp;
                <v-checkbox
                  v-model="miercolesPromo"
                  label="Miércoles"
                  color="#f45c04"
                ></v-checkbox
                >&nbsp;
                <v-checkbox
                  v-model="juevesPromo"
                  label="Jueves"
                  color="#f45c04"
                ></v-checkbox
                >&nbsp;
                <v-checkbox
                  v-model="viernesPromo"
                  label="Viernes"
                  color="#f45c04"
                ></v-checkbox
                >&nbsp;
                <v-checkbox
                  v-model="sabadoPromo"
                  label="Sábado"
                  color="#f45c04"
                ></v-checkbox
                >&nbsp;
                <v-checkbox
                  v-model="domingoPromo"
                  label="Domingo"
                  color="#f45c04"
                ></v-checkbox
                >&nbsp;
              </div>
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
  name: 'Promocion',
  layout: 'restaurantePage',
  data: () => ({
    promociones: [],
    tituloPromo: null,
    tituloPromoRules: [(v) => !!v || 'Título es requerido'],
    subtituloPromo: null,
    subtituloPromoRules: [(v) => !!v || 'Subtítulo es requerido'],
    precioPromo: null,
    precioPromoRules: [(v) => !!v || 'Precio es requerido'],
    etiquetaPromo: null,
    etiquetaPromoRules: [(v) => !!v || 'Etiqueta es requerido'],
    imagenPromo: null,
    imagenPromoRules: [(v) => !!v || 'Imágen es requerido'],
    imagenUrl: '',
    descripcionPromo: '',
    lunesPromo: false,
    martesPromo: false,
    miercolesPromo: false,
    juevesPromo: false,
    viernesPromo: false,
    sabadoPromo: false,
    domingoPromo: false,
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

    const c = await axios.get(
      env.endpoint + '/promociones.php?restaurante=' + this.idC
    )
    this.promociones = c.data.data.filter((a) => a.estado !== 2)
  },
  methods: {
    async cambiarEstadoPromo(ide, es) {
      const e = await axios.patch(env.endpoint + '/promociones.php', {
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
          .child(`promociones/${nombre}`)

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

                let d = ''

                if (!!this.lunesPromo === true) {
                  d += '1'
                } else {
                  d += '0'
                }

                if (!!this.martesPromo === true) {
                  d += '1'
                } else {
                  d += '0'
                }

                if (!!this.miercolesPromo === true) {
                  d += '1'
                } else {
                  d += '0'
                }

                if (!!this.juevesPromo === true) {
                  d += '1'
                } else {
                  d += '0'
                }

                if (!!this.viernesPromo === true) {
                  d += '1'
                } else {
                  d += '0'
                }

                if (!!this.sabadoPromo === true) {
                  d += '1'
                } else {
                  d += '0'
                }
                if (!!this.domingoPromo === true) {
                  d += '1'
                } else {
                  d += '0'
                }

                const js = {
                  tituloPromocion: this.tituloPromo,
                  subtituloPromocion: this.subtituloPromo,
                  descripcion: this.descripcionPromo,
                  idComercio: this.idC,
                  precio: this.precioPromo,
                  imagen: downloadURL,
                  etiquetaPromocion: this.etiquetaPromo,
                  dias: d,
                }

                const r = await axios.post(
                  env.endpoint + '/promociones.php',
                  js
                )

                this.error = true
                this.error_msg = r.data.message

                this.cancelar()

                // Promos del comercio
                const p = await axios.get(
                  env.endpoint + '/promociones.php?restaurante=' + this.idC
                )
                this.promociones = p.data.data.filter((a) => a.estado !== 2)
              })
          }
        )
      }
    },
    editarPromo(id) {
      this.dialog = true
      this.editando = true
      const pr = this.promociones.filter((a) => a.idPromocion === id)[0]
      this.idPr = pr.idPromocion
      this.auxEstado = pr.estado

      /* this.descripcionPromo = null
      this.imagenPromo = new File([''], 'filename')
      this.imagenUrl = pr.imagen
      this.auxImg = pr.imagen
      this.precioPromo = pr.precio */

      this.tituloPromo = pr.tituloPromocion
      this.subtituloPromo = pr.subtituloPromocion
      this.precioPromo = pr.precio
      this.etiquetaPromo = pr.etiquetaPromocion
      this.imagenPromo = new File([''], 'filename')
      this.imagenUrl = pr.imagen
      this.auxImg = pr.imagen
      this.descripcionPromo = pr.descripcion
      this.lunesPromo = !!pr.dias[0].valido /*  === 1 ? true : false */
      this.martesPromo = !!pr.dias[1].valido /* === 1 ? true : false */
      this.miercolesPromo = !!pr.dias[2].valido /* === 1 ? true : false */
      this.juevesPromo = !!pr.dias[3].valido /* === 1 ? true : false */
      this.viernesPromo = !!pr.dias[4].valido /* === 1 ? true : false */
      this.sabadoPromo = !!pr.dias[5].valido /* === 1 ? true : false */
      this.domingoPromo = !!pr.dias[6].valido /* === 1 ? true : false */
    },
    vaciarPromo() {
      this.idPr = null
      this.auxEstado = false

      /* this.descripcionPromo = null
      this.precioPromo = null
      this.imagenPromo = null
      this.imagenUrl = ''
      this.auxImg = '' */

      this.tituloPromo = null
      this.subtituloPromo = null
      this.precioPromo = null
      this.etiquetaPromo = null
      this.imagenPromo = null
      this.imagenUrl = ''
      this.auxImg = null
      this.descripcionPromo = null
      this.lunesPromo = false
      this.martesPromo = false
      this.miercolesPromo = false
      this.juevesPromo = false
      this.viernesPromo = false
      this.sabadoPromo = false
      this.domingoPromo = false
    },
    cancelar() {
      this.dialog = false
      this.editando = false
      this.vaciarPromo()
    },
    async eliminarPromo() {
      const p = await axios.patch(env.endpoint + '/promociones.php', {
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
            .child(`promociones/${nombre}`)

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
                  let d = ''

                  if (!!this.lunesPromo === true) {
                    d += '1'
                  } else {
                    d += '0'
                  }

                  if (!!this.martesPromo === true) {
                    d += '1'
                  } else {
                    d += '0'
                  }

                  if (!!this.miercolesPromo === true) {
                    d += '1'
                  } else {
                    d += '0'
                  }

                  if (!!this.juevesPromo === true) {
                    d += '1'
                  } else {
                    d += '0'
                  }

                  if (!!this.viernesPromo === true) {
                    d += '1'
                  } else {
                    d += '0'
                  }

                  if (!!this.sabadoPromo === true) {
                    d += '1'
                  } else {
                    d += '0'
                  }
                  if (!!this.domingoPromo === true) {
                    d += '1'
                  } else {
                    d += '0'
                  }

                  alert(d)
                  const e = this.auxEstado === true ? 1 : 0

                  const pe = {
                    idPromocion: this.idPr,
                    tituloPromocion: this.tituloPromo,
                    subtituloPromocion: this.subtituloPromo,
                    descripcion: this.descripcionPromo,
                    idComercio: this.idC,
                    precio: this.precioPromo,
                    imagen: downloadURL,
                    etiquetaPromocion: this.etiquetaPromo,
                    dias: d,
                    estado: e,
                    observaciones: 'S/O',
                  }

                  const r = await axios.put(
                    env.endpoint + '/promociones.php',
                    pe
                  )

                  this.error = true
                  this.error_msg = r.data.message

                  this.cancelar()

                  // Promos del comercio
                  const p = await axios.get(
                    env.endpoint + '/promociones.php?restaurante=' + this.idC
                  )
                  this.promociones = p.data.data.filter((a) => a.estado !== 2)
                })
            }
          )
        } else {
          let d = ''

          if (!!this.lunesPromo === true) {
            d += '1'
          } else {
            d += '0'
          }

          if (!!this.martesPromo === true) {
            d += '1'
          } else {
            d += '0'
          }

          if (!!this.miercolesPromo === true) {
            d += '1'
          } else {
            d += '0'
          }

          if (!!this.juevesPromo === true) {
            d += '1'
          } else {
            d += '0'
          }

          if (!!this.viernesPromo === true) {
            d += '1'
          } else {
            d += '0'
          }

          if (!!this.sabadoPromo === true) {
            d += '1'
          } else {
            d += '0'
          }
          if (!!this.domingoPromo === true) {
            d += '1'
          } else {
            d += '0'
          }

          const pe = {
            idPromocion: this.idPr,
            tituloPromocion: this.tituloPromo,
            subtituloPromocion: this.subtituloPromo,
            descripcion: this.descripcionPromo,
            idComercio: this.idC,
            precio: this.precioPromo,
            imagen: this.auxImg,
            etiquetaPromocion: this.etiquetaPromo,
            dias: d,
            estado: this.auxEstado,
            observaciones: 'S/O',
          }

          const r = await axios.put(env.endpoint + '/promociones.php', pe)

          this.error = true
          this.error_msg = r.data.message

          this.cancelar()

          // Promos del comercio
          const p = await axios.get(
            env.endpoint + '/promociones.php?restaurante=' + this.idC
          )
          this.promociones = p.data.data.filter((a) => a.estado !== 2)
        }
      }
    },
  },
}
</script>

<style></style>
