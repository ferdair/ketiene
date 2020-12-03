<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="9">
        <h3>Fechas especiales</h3>
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
      v-for="promo in fechasEspeciales"
      :key="promo.idFechaEspecial"
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
            <span class="blue-grey--text text-h6">
              <h3>
                &nbsp;&nbsp;&nbsp;{{
                  promo.tituloFechaEspecial
                }}&nbsp;&nbsp;&nbsp;${{ promo.precio }}
              </h3></span
            >
            <v-spacer></v-spacer>
            <v-btn icon @click="editarPromo(promo.idFechaEspecial)"
              ><v-icon>mdi-pencil</v-icon></v-btn
            >
            <v-switch
              v-model="promo.estado"
              color="#f45c04"
              @change="cambiarEstadoPromo(promo.idFechaEspecial, promo.estado)"
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
            Nueva Opción de Fecha Especial</v-card-title
          >
          <v-card-text v-if="otro === false">
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="tituloPromo"
                :rules="tituloPromoRules"
                label="Título"
                required
                outlined
              ></v-text-field>
              <v-autocomplete
                v-model="tipoPromo"
                :rules="tipoPromoRules"
                label="Tipo de Fecha Especial"
                required
                outlined
                :items="tiposFechas"
                item-text="tituloFecha"
                item-value="idTipoFechaEspecial"
                @change="mostrarFormTipo"
              >
              </v-autocomplete>

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
          <v-card-text v-if="otro === true">
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="tituloTipo"
                :rules="tituloTipoRules"
                label="Título"
                required
                outlined
              ></v-text-field>
              <v-autocomplete
                outlined
                label="icono"
                :items="iconos2"
                v-model="iconoTipo"
                :rules="iconoTipoRules"
              >
                <template slot="selection" slot-scope="{ item }">
                  <v-icon> {{ item }} </v-icon>
                </template>
                <template slot="item" slot-scope="{ item }">
                  <v-icon> {{ item }} </v-icon>
                </template>
              </v-autocomplete>
              <!--   <v-autocomplete
                v-model="tipoPromo"
                :rules="tipoPromoRules"
                label="Tipo de Fecha Especial"
                required
                outlined
                :items="tiposFechas"
                item-text="tituloFecha"
                item-value="idTipoFechaEspecial"
              >
              </v-autocomplete> -->

              <!-- <v-text-field
                v-model="etiquetaPromo"
                :rules="etiquetaPromoRules"
                label="Etiqueta"
                required
                outlined
                hint="Ejemplo: Gratis"
              ></v-text-field> -->
              <!--  <v-text-field
                prefix="$"
                v-model="precioPromo"
                :rules="precioPromoRules"
                label="Precio"
                required
                outlined
                type="number"
              ></v-text-field> -->
              <v-file-input
                accept="image/*"
                label="Logo"
                v-model="imagenTipo"
                @change="urlImagen"
                :clearable="false"
                outlined
                :rules="imagenTipoRules"
              ></v-file-input>
              <div class="d-flex justify-center">
                <v-icon v-if="imagenTipo === null">mdi-camera-plus</v-icon>
                <v-img
                  v-else
                  :src="imagenTipoUrl"
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
              <!--  <v-textarea
                outlined
                label="Descripción"
                auto-grow
                v-model="descripcionPromo"
              ></v-textarea> -->
            </v-form>
          </v-card-text>
          <v-card-actions v-if="otro === true">
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="cancelar()">
              Cancelar
            </v-btn>
            <v-btn color="green darken-1" text @click="registrarCategoria()">
              Guardar
            </v-btn>
          </v-card-actions>
          <v-card-actions v-else>
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
  name: 'FechaEspecial',
  layout: 'restaurantePage',
  data: () => ({
    fechasEspeciales: [],
    tiposFechas: [],
    tituloPromo: null,
    tituloPromoRules: [(v) => !!v || 'Título es requerido'],
    tipoPromo: null,
    tipoPromoRules: [(v) => !!v || 'Tipo de Fecha especial es requerido'],
    precioPromo: null,
    precioPromoRules: [(v) => !!v || 'Precio es requerido'],
    imagenPromo: null,
    imagenPromoRules: [(v) => !!v || 'Imágen es requerido'],
    imagenUrl: '',
    descripcionPromo: '',
    tituloTipo: null,
    tituloTipoRules: [(v) => !!v || 'Título es requerido'],
    iconoTipo: null,
    iconoTipoRules: [(v) => !!v || 'Ícono es requerido'],
    imagenTipo: null,
    imagenTipoRules: [(v) => !!v || 'Imágen es requerido'],
    imagenTipoUrl: '',
    error: false,
    error_msg: '',
    dialog: false,
    valid: true,
    idC: null,
    editando: false,
    auxImg: '',
    auxEstado: false,
    idPr: null,
    otro: false,
    iconos2: [
      'mdi-baguette',
      'mdi-earth',
      'mdi-room-service ',
      'mdi-room-service-outline',
      'mdi-bowl-mix',
      'mdi-bowl-mix-outline',
      'mdi-bread-slice-outline',
      'mdi-cake',
      'mdi-cake-layered',
      'mdi-cake-variant',
      'mdi-candycane',
      'mdi-cheese',
      'mdi-coffee',
      'mdi-coffee-outline',
      'mdi-cookie',
      'mdi-cookie-outline',
      'mdi-corn',
      'mdi-cupcake',
      'mdi-fish',
      'mdi-food',
      'mdi-food-croissant',
      'mdi-food-drumstick',
      'mdi-food-fork-drink',
      'mdi-food-steak',
      'mdi-glass-cocktail',
      'mdi-glass-mug-variant',
      'mdi-grill-outline',
      'mdi-hamburger',
      'mdi-ice-cream',
      'mdi-ice-pop',
      'mdi-leaf',
      'mdi-noodles',
      'mdi-pasta',
      'mdi-pizza',
      'mdi-pot-mix',
      'mdi-pot-steam',
      'mdi-rice',
      'mdi-sausage',
      'mdi-silverware-clean',
      'mdi-silverware-variant',
    ],
  }),
  async mounted() {
    this.idC = this.$route.params.id

    // Fechas Especiales

    const c = await axios.get(
      env.endpoint + '/fechasEspeciales.php?id=' + this.idC
    )
    this.fechasEspeciales = c.data.data.filter((a) => a.estado !== 2)

    // Tipos de Fechas Especiales
    const f = await axios.get(env.endpoint + '/tipoFechaEspecial.php')
    this.tiposFechas = f.data.data

    this.tiposFechas.splice(0, 0, {
      idTipoFechaEspecial: 0,
      tituloFecha: 'Otro',
    })
  },
  methods: {
    async cambiarEstadoPromo(ide, es) {
      const e = await axios.patch(env.endpoint + '/fechasEspeciales.php', {
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

      if (this.imagenTipo) {
        this.imagenTipoUrl = URL.createObjectURL(this.imagenTipo)
      } else {
        this.imagenTipo = new File([''], 'filename')
        this.imagenTipoUrl = ''
      }
    },
    subirImagen() {
      if (this.$refs.form.validate()) {
        const nombre = Date.now()
        /*eslint-disable */
        var storageRef = this.$fireModule
          .storage()
          .ref()
          .child(`/fechasespeciales/${nombre}`)

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
                  tituloFechaEspecial: this.tituloPromo,
                  descripcion: this.descripcionPromo,
                  idComercio: this.idC,
                  precio: this.precioPromo,
                  tipoFechaEspecial: this.tipoPromo,
                }

                const r = await axios.post(
                  env.endpoint + '/fechasEspeciales.php',
                  js
                )

                this.error = true
                this.error_msg = r.data.message

                this.cancelar()

                // Promos del comercio
                const p = await axios.get(
                  env.endpoint + '/fechasEspeciales.php?id=' + this.idC
                )
                this.fechasEspeciales = p.data.data.filter(
                  (a) => a.estado !== 2
                )
              })
          }
        )
      }
    },
    editarPromo(id) {
      this.dialog = true
      this.editando = true
      const pr = this.fechasEspeciales.filter(
        (a) => a.idFechaEspecial === id
      )[0]
      this.idPr = pr.idFechaEspecial
      this.auxEstado = pr.estado

      this.tituloPromo = pr.tituloFechaEspecial
      this.descripcionPromo = pr.descripcion
      this.imagenPromo = new File([''], 'filename')
      this.imagenUrl = pr.imagen
      this.auxImg = pr.imagen
      this.precioPromo = pr.precio
      this.tipoPromo = pr.idTipoFechaEspecial
    },
    vaciarPromo() {
      this.idPr = null
      this.auxEstado = false

      this.tituloPromo = null
      this.descripcionPromo = null
      this.imagenPromo = null
      this.imagenUrl = ''
      this.auxImg = ''
      this.precioPromo = null
      this.tipoPromo = null
    },
    cancelar() {
      this.dialog = false
      this.editando = false
      this.otro = false
      this.vaciarPromo()
    },
    async eliminarPromo() {
      const p = await axios.patch(env.endpoint + '/fechasEspeciales.php', {
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
            .child(`fechasespeciales/${nombre}`)

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
                    idFechaEspecial: this.idPr,
                    tituloFechaEspecial: this.tituloPromo,
                    descripcion: this.descripcionPromo,
                    imagen: downloadURL,
                    idComercio: this.idC,
                    precio: this.precioPromo,
                    tipoFechaEspecial: this.tipoPromo,
                    estado: e,
                    observaciones: 'S/O',
                  }

                  const r = await axios.put(
                    env.endpoint + '/fechasEspeciales.php',
                    pe
                  )

                  this.error = true
                  this.error_msg = r.data.message

                  this.cancelar()

                  // Promos del comercio
                  const p = await axios.get(
                    env.endpoint + '/fechasEspeciales.php?id=' + this.idC
                  )
                  this.fechasEspeciales = p.data.data.filter(
                    (a) => a.estado !== 2
                  )
                })
            }
          )
        } else {
          const pe = {
            idFechaEspecial: this.idPr,
            tituloFechaEspecial: this.tituloPromo,
            descripcion: this.descripcionPromo,
            imagen: this.auxImg,
            idComercio: this.idC,
            precio: this.precioPromo,
            tipoFechaEspecial: this.tipoPromo,
            estado: this.auxEstado,
            observaciones: 'S/O',
          }

          const r = await axios.put(env.endpoint + '/fechasEspeciales.php', pe)

          this.error = true
          this.error_msg = r.data.message

          this.cancelar()

          // Promos del comercio
          const p = await axios.get(
            env.endpoint + '/fechasEspeciales.php?id=' + this.idC
          )
          this.fechasEspeciales = p.data.data.filter((a) => a.estado !== 2)
        }
      }
    },
    mostrarFormTipo(id) {
      this.otro = id === 0 ? !this.otro : this.otro
    },
    cerrarDialog() {
      this.dialog = false
      this.otro = false
    },
    registrarCategoria() {
      if (this.$refs.form.validate()) {
        const nombre = Date.now()
        /*eslint-disable */
        var storageRef = this.$fireModule
          .storage()
          .ref()
          .child(`/tipofechas/${nombre}`)

        var uploadTask = storageRef.put(this.imagenTipo)
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

                /* const c = await axios.post(env.endpoint + '/tipoProducto.php', {
                  nombreTipoProducto: this.nombreCat,
                  icono: this.iconoCat,
                })

                this.error = true
                this.error_msg = c.data.message

                const a = await axios.get(env.endpoint + '/tipoProducto.php')
                this.categorias = a.data.data
                this.cerrarDialog() */

                const js = {
                  tituloFecha: this.tituloTipo,
                  icono: this.iconoTipo,
                  imagenFondo: this.downloadURL,
                }

                const r = await axios.post(
                  env.endpoint + '/tipoFechaEspecial.php',
                  js
                )

                this.error = true
                this.error_msg = r.data.message

                this.cancelar()
                this.cerrarDialog()

                // Tipos de Promos del comercio
                const p = await axios.get(
                  env.endpoint + '/tipoFechaEspecial.php'
                )
                this.tiposFechas = p.data.data.filter((a) => a.estado !== 2)

                this.tiposFechas.splice(0, 0, {
                  idTipoFechaEspecial: 0,
                  tituloFecha: 'Otro',
                })
              })
          }
        )
      }
    },
  },
}
</script>

<style></style>
