<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="9">
        <h3>Items</h3>
        <v-subheader>
          Los items son los productos de su menú, por ejemplo: Hamburguesa con
          queso
        </v-subheader>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn left rounded color="#f45c04" dark @click="dialog = true">
          <v-icon large left>mdi-plus</v-icon>
          Agregar Item
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="orange darken-4">
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
    </v-row>

    <v-row v-for="prodC in productos" :key="prodC.idProducto" justify="start">
      <v-col cols="12">
        <v-card outlined>
          <v-row justify="start" align="center" class="px-4">
            <v-icon>mdi-menu</v-icon>
            <v-avatar class="profile" color="grey" size="50" tile>
              <v-img :src="prodC.imagen"></v-img>
            </v-avatar>
            <!-- <v-img :src="prodC.imagen" max-height="50" contain></v-img> -->
            <h3>{{ prodC.nombreProducto }}</h3>
            &nbsp;
            <span class="indigo darken-4 white--text text-h6"
              >&nbsp;<v-icon dark>{{ prodC.iconoEtiqueta }}</v-icon
              >&nbsp; {{ prodC.nombreEtiqueta }}</span
            >
            <v-spacer></v-spacer>
            <v-btn icon @click="editarProducto(prodC.idProducto)"
              ><v-icon>mdi-pencil</v-icon></v-btn
            >
            <v-switch
              v-model="prodC.estado"
              color="#f45c04"
              @change="cambiarEstadoProd(prodC.idProducto, prodC.estado)"
            >
            </v-switch>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="550">
        <v-card>
          <v-card-title class="headline"> Nuevo Ítem </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-autocomplete
                v-model="categoriaNueva"
                :rules="categoriaNuevaRules"
                label="Categoría"
                required
                outlined
                :items="categoriasC"
                item-text="nombreTipoProducto"
                item-value="idTipoProducto"
              >
              </v-autocomplete>
              <v-text-field
                v-model="nombreItem"
                :rules="nombreItemRules"
                label="Nombre del Item"
                required
                outlined
              ></v-text-field>
              <v-text-field
                prefix="$"
                v-model="precioItem"
                :rules="precioItemRules"
                label="Precio del Item"
                required
                outlined
                type="number"
              ></v-text-field>
              <v-file-input
                accept="image/*"
                label="Logo"
                v-model="imagenItem"
                @change="urlImagen"
                :clearable="false"
                outlined
                :rules="imagenItemRules"
              ></v-file-input>
              <div class="d-flex justify-center">
                <v-icon v-if="imagenItem === null">mdi-camera-plus</v-icon>
                <v-img
                  v-else
                  :src="imagenUrl"
                  max-height="150"
                  max-width="250"
                  contain
                >
                </v-img>
              </div>
              <v-autocomplete
                v-model="etiquetaItem"
                :rules="etiquetaItemRules"
                label="Etiqueta"
                required
                outlined
                :items="etiquetas"
                item-text="nombreEtiqueta"
                item-value="idEtiquetaProducto"
              >
              </v-autocomplete>
              <v-textarea
                outlined
                label="Descripción"
                auto-grow
                v-model="descripcionItem"
                :rules="descripcionItemRules"
              ></v-textarea>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red"
              text
              @click="eliminarProducto()"
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
  name: 'Items',
  layout: 'restaurantePage',
  data: () => ({
    categoriasC: [],
    categoriaNueva: null,
    categoriaNuevaRules: [(v) => !!v || 'Categoría es requerido'],
    nombreItem: null,
    nombreItemRules: [(v) => !!v || 'Nombre es requerido'],
    precioItem: null,
    precioItemRules: [(v) => !!v || 'Precio es requerido'],
    imagenItem: null,
    imagenItemRules: [(v) => !!v || 'Imágen es requerido'],
    imagenUrl: '',
    descripcionItem: null,
    descripcionItemRules: [(v) => !!v || 'Descripción es requerido'],
    etiquetaItem: null,
    etiquetaItemRules: [(v) => !!v || 'Etiqueta es requerido'],
    productosC: null,
    error: false,
    error_msg: '',
    categoria: null,
    productos: [],
    dialog: false,
    valid: true,
    idC: null,
    etiquetas: [],
    idPr: null,
    editando: false,
    auxImg: '',
    auxEstado: false,
  }),
  async mounted() {
    // id Comerciodialog
    this.idC = this.$route.params.id

    // Categorías del comercio
    const cc = await axios.get(
      env.endpoint + '/tipoProductoComercio.php?id=' + this.idC
    )

    this.categoriasC = cc.data.data.filter((e) => e.estado === 0)

    // Productos del comercio
    const p = await axios.get(
      env.endpoint + '/productos.php?restaurante=' + this.idC
    )
    this.productosC = p.data.data.filter((a) => a.estado !== 2)

    this.formatearEstadoProducto()

    // Etiquetas de productos

    const e = await axios.get(env.endpoint + '/etiquetaProducto.php')
    this.etiquetas = e.data.data

    /*  this.productosC.forEach((element) => {
      const i = this.etiquetas.filter(
        (a) => a.idEtiquetaProducto === element.idEtiqueta
      )
      element.icono = i
    }) */
  },
  methods: {
    formatearEstadoProducto() {
      this.productosC.forEach((element) => {
        const e = !element.estado
        element.estado = e
      })
    },
    async cambiarEstadoProd(ide, es) {
      const e = await axios.patch(env.endpoint + '/productos.php', {
        id: ide,
        campo: 'estado',
        dato: !es,
      })

      this.error = true
      this.error_msg = e.data.message
    },
    cambiarProductos(cat) {
      this.productos = this.productosC.filter(
        (a) => a.idTipoProductoComercio === cat
      )
    },
    urlImagen() {
      if (this.imagenItem) {
        this.imagenUrl = URL.createObjectURL(this.imagenItem)
      } else {
        this.imagenItem = new File([''], 'filename')
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
          .child(`productos/${nombre}`)

        var uploadTask = storageRef.put(this.imagenItem)
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
                  nombreProducto: this.nombreItem,
                  descripcion: this.descripcionItem,
                  idComercio: this.idC,
                  precio: this.precioItem,
                  imagen: downloadURL,
                  idEtiqueta: this.etiquetaItem,
                  sucursaleExcluidas: '',
                  idTipoProductoDetalle: this.categoriaNueva,
                }

                const r = await axios.post(env.endpoint + '/productos.php', js)

                this.error = true
                this.error_msg = r.data.message

                this.vaciarProducto()

                // Productos del comercio
                const p = await axios.get(
                  env.endpoint + '/productos.php?restaurante=' + this.idC
                )
                this.productosC = p.data.data.filter((a) => a.estado !== 2)

                this.formatearEstadoProducto()
              })
          }
        )
      }
    },
    editarProducto(id) {
      this.dialog = true
      this.editando = true
      const pr = this.productosC.filter((a) => a.idProducto === id)[0]
      this.idPr = pr.idProducto
      this.auxEstado = pr.estado
      this.nombreItem = pr.nombreProducto
      this.descripcionItem = pr.descripcion
      this.precioItem = pr.precio
      this.imagenItem = new File([''], 'filename')
      this.imagenUrl = pr.imagen
      this.auxImg = pr.imagen
      this.etiquetaItem = pr.idEtiqueta
      this.categoriaNueva = pr.idTipoProducto
    },
    vaciarProducto() {
      this.idPr = null
      this.auxEstado = false
      this.nombreItem = ''
      this.descripcionItem = ''
      this.precioItem = null
      this.imagenItem = null
      this.imagenUrl = ''
      this.etiquetaItem = null
      this.categoriaNueva = null
      this.auxImg = ''
    },
    cancelar() {
      this.dialog = false
      this.editando = false
      this.vaciarProducto()
    },
    async eliminarProducto() {
      const p = await axios.patch(env.endpoint + '/productos.php', {
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
        if (this.imagenItem.name !== 'filename') {
          const nombre = Date.now()
          /*eslint-disable */
          var storageRef = this.$fireModule
            .storage()
            .ref()
            .child(`productos/${nombre}`)

          var uploadTask = storageRef.put(this.imagenItem)
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

                  const e = this.auxEstado === true ? '0' : '1'

                  const pe = {
                    idProducto: this.idPr,
                    nombreProducto: this.nombreItem,
                    descripcion: this.descripcionItem,
                    idComercio: this.idC,
                    precio: this.precioItem,
                    imagen: downloadURL,
                    idEtiqueta: this.etiquetaItem,
                    sucursaleExcluidas: '',
                    idTipoProductoDetalle: this.categoriaNueva,
                    observaciones: 'S/O',
                    estado: Number(e),
                  }

                  const r = await axios.put(env.endpoint + '/productos.php', pe)

                  this.error = true
                  this.error_msg = r.data.message

                  this.vaciarProducto()

                  // Productos del comercio
                  const p = await axios.get(
                    env.endpoint + '/productos.php?restaurante=' + this.idC
                  )
                  this.productosC = p.data.data.filter((a) => a.estado !== 2)

                  this.formatearEstadoProducto()
                })
            }
          )
        } else {
          const pe = {
            idProducto: this.idPr,
            nombreProducto: this.nombreItem,
            descripcion: this.descripcionItem,
            idComercio: this.idC,
            precio: this.precioItem,
            imagen: this.auxImg,
            idEtiqueta: this.etiquetaItem,
            sucursaleExcluidas: '',
            idTipoProductoDetalle: this.categoriaNueva,
            observaciones: 'S/O',
            estado: this.auxEstado,
          }

          const r = await axios.put(env.endpoint + '/productos.php', pe)

          this.error = true
          this.error_msg = r.data.message

          this.vaciarProducto()

          // Productos del comercio
          const p = await axios.get(
            env.endpoint + '/productos.php?restaurante=' + this.idC
          )
          this.productosC = p.data.data.filter((a) => a.estado !== 2)

          this.formatearEstadoProducto()
        }
      }
    },
  },
}
</script>

<style></style>
