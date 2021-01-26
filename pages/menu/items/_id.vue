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
          @change="cambiarProductos()"
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
            <v-btn icon @click="alertEliminar(prodC.idProducto)"
              ><v-icon>mdi-delete</v-icon></v-btn
            >
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
              <v-row>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="categoriaNueva"
                    :rules="categoriaNuevaRules"
                    label="Categoría"
                    required
                    outlined
                    :items="categoriasC"
                    item-text="nombreTipoProducto"
                    item-value="idTipoProductoComercio"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="nombreItem"
                    :rules="nombreItemRules"
                    label="Nombre del Item"
                    required
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="8">
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        prefix="$"
                        v-model="precioItem"
                        :rules="precioItemRules"
                        label="Precio Actual"
                        required
                        outlined
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        prefix="$"
                        v-model="precioAnterior"
                        :rules="precioAnteriorRules"
                        label="Precio Anterior"
                        required
                        outlined
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-autocomplete
                        v-model="etiquetaItem"
                        :rules="etiquetaItemRules"
                        label="Etiqueta"
                        required
                        outlined
                        :items="etiquetas"
                        item-text="nombreEtiqueta"
                        item-value="idEtiquetaProducto"
                        prepend-inner-icon="mdi-tag"
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        outlined
                        label="Descripción"
                        auto-grow
                        v-model="descripcionItem"
                        :rules="descripcionItemRules"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="4">
                  <v-row>
                    <v-col cols="12">
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
                        <v-icon v-if="imagenItem === null"
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
                      <div>
                        *Se Recomienda que las imagen es tengan una relación de
                        aspecto de 1.2817 Ejemplo 1281.7 x 1000 414 x 323
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
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
            <v-btn text @click="cancelar()"> Cancelar </v-btn>
            <v-btn
              color="#f45c04"
              @click="subirImagen()"
              v-if="editando === false"
              dark
            >
              Guardar
            </v-btn>
            <v-btn
              color="#f45c04"
              dark
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
    precioAnterior: null,
    precioAnteriorRules: [(v) => !!v || 'Precio Anterior es requerido'],
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

    if (cc.data.data === false) {
      this.categoriasC = []
    } else {
      this.categoriasC = cc.data.data.filter((e) => e.estado !== 3)
    }

    // Productos del comercio
    const p = await axios.get(
      env.endpoint + '/productos.php?restaurante=' + this.idC
    )

    if (p.data.data === false) {
      this.productosC = []
    } else {
      this.productosC = p.data.data.filter((a) => a.estado !== 3)

      this.productosC = this.productosC.map((a) => {
        const es = a.estado !== 2
        a.estado = es
        return a
      })
    }

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
      const x = es === false ? '2' : '1'

      const e = await axios.patch(env.endpoint + '/productos.php', {
        id: ide,
        campo: 'estado',
        dato: Number(x),
      })

      this.alertCambio(e.data.data, e.data.message)
      this.actualizarProductos()
    },
    cambiarProductos() {
      /*  this.productos = this.productosC.filter(
        (a) => a.idTipoProducto === this.categoria
      ) */

      this.productos = this.productosC.filter(
        (l) => l.idTipoProductoComercio === this.categoria
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

                /*                 const js = {
                  nombreProducto: this.nombreItem,
                  descripcion: this.descripcionItem,
                  idComercio: this.idC,
                  precio: this.precioItem,
                  imagen: downloadURL,
                  idEtiqueta: this.etiquetaItem,
                  sucursaleExcluidas: '',
                  idTipoProductoDetalle: this.categoriaNueva,
                }
 */

                const js = {
                  nombreProducto: this.nombreItem,
                  descripcion: this.descripcion,
                  idComercio: this.idC,
                  precio: Number(this.precioItem),
                  precioAnterio: Number(this.precioAnterior),
                  imagen: downloadURL,
                  idEtiqueta: this.etiquetaItem,
                  sucursaleExcluidas: '',
                  idTipoProductoDetalle: this.categoriaNueva,
                }

                const r = await axios.post(env.endpoint + '/productos.php', js)

                this.alertCambio(r.data.data, r.data.message)

                this.vaciarProducto()
                this.cancelar()
                this.actualizarProductos()

                /*  this.error = true
                this.error_msg = r.data.message

                this.vaciarProducto()

                // Productos del comercio
                const p = await axios.get(
                  env.endpoint + '/productos.php?restaurante=' + this.idC
                )
                this.productosC = p.data.data.filter((a) => a.estado !== 2)

                this.formatearEstadoProducto() */
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
      this.precioAnterior = pr.precioAnterio
      this.imagenItem = new File([''], 'filename')
      this.imagenUrl = pr.imagen
      this.auxImg = pr.imagen
      this.etiquetaItem = pr.idEtiqueta
      this.categoriaNueva = pr.idTipoProductoComercio
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
      this.precioAnterior = null
    },
    cancelar() {
      this.vaciarProducto()
      this.dialog = false
      this.editando = false
    },
    eliminarProducto() {
      this.alertEliminar(this.idPr)

      this.cancelar()
      this.actualizarProductos()
    },
    async actualizarProductos() {
      const id = this.$route.params.id
      let data = (
        await axios.get(env.endpoint + '/productos.php?restaurante=' + id)
      ).data.data

      if (data === false) {
        this.productosC = []
      } else {
        data = data.filter((a) => a.estado !== 3)
        data = data.map((a) => {
          const es = a.estado !== 2
          a.estado = es
          return a
        })

        this.productosC = data
        this.cambiarProductos()
      }
    },
    alertCambio(respuesta, mensaje) {
      const ico = respuesta === true ? 'success' : 'error'
      this.$swal({ icon: ico, title: mensaje })
    },
    alertEliminar(ide) {
      this.$swal({
        title: '¿Desea Eliminar el Producto Deportivo?',
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
          const e = await axios.patch(env.endpoint + '/productos.php', js)

          this.alertCambio(e.data.data, e.data.message)
          this.actualizarProductos()
        }
      })
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

                  const e = this.auxEstado === true ? '1' : '2'

                  /*  {
 "id":2,
 "nombreProducto":"Licor de Lima Natural",
 "descripcion":"15 v/v Licores don Joshé",
 "idComercio":1,
 "precio":9.99,
 "precioAnterior":10.99,
 "imagen":"licorLimaDon.jpg",
 "idEtiqueta":0,
 "sucursaleExcluidas":"",
 "idTipoProductoDetalle":1,
 "observaciones":"S/O",
 "estado":20
} */

                  const json = {
                    id: this.idPr,
                    nombreProducto: this.nombreItem,
                    descripcion: this.descripcionItem,
                    idComercio: this.idC,
                    precio: Number(this.precioItem),
                    precioAnterior: Number(this.precioAnterior),
                    imagen: downloadURL,
                    idEtiqueta: this.etiquetaItem,
                    sucursaleExcluidas: '',
                    idTipoProductoDetalle: this.categoriaNueva,
                    observaciones: 'S/O',
                    estado: Number(e),
                  }

                  const r = await axios.put(
                    env.endpoint + '/productos.php',
                    json
                  )

                  this.alertCambio(r.data.data, r.data.message)

                  this.vaciarProducto()
                  this.cancelar()
                  this.actualizarProductos()
                  /*
                  // Productos del comercio
                  const p = await axios.get(
                    env.endpoint + '/productos.php?restaurante=' + this.idC
                  )
                  this.productosC = p.data.data.filter((a) => a.estado !== 2)

                  this.formatearEstadoProducto() */
                })
            }
          )
        } else {
          /*  const json = {
                    id: this.idPr,
                    nombreProducto: this.nombreItem,
                    descripcion: this.descripcionItem,
                    idComercio: this.idC,
                    precio: this.precioItem,
                    precioAnterior: this.precioAnterior,
                    imagen: downloadURL,
                    idEtiqueta: this.etiquetaItem,
                    sucursaleExcluidas: '',
                    idTipoProductoDetalle: this.categoriaNueva,
                    observaciones: 'S/O',
                    estado: Number(e),
                  } */

          const e = this.auxEstado === true ? '1' : '2'

          const json = {
            id: this.idPr,
            nombreProducto: this.nombreItem,
            descripcion: this.descripcionItem,
            idComercio: this.idC,
            precio: Number(this.precioItem),
            precioAnterior: Number(this.precioAnterior),
            imagen: this.auxImg,
            idEtiqueta: this.etiquetaItem,
            sucursaleExcluidas: '',
            idTipoProductoDetalle: this.categoriaNueva,
            observaciones: 'S/O',
            estado: Number(e),
          }

          const r = await axios.put(env.endpoint + '/productos.php', json)

          this.alertCambio(r.data.data, r.data.message)

          this.vaciarProducto()
          this.cancelar()
          this.actualizarProductos()
        }
      }
    },
  },
}
</script>

<style></style>
