<template>
  <v-container>
    <v-row>
      <v-col cols="6" md="3">
        <v-card
          class="ma-0 text-center pt-3 rounded-lg"
          elevation="5"
          :to="`/menu/promocion/${this.$route.params.id}`"
        >
          <v-icon size="100" color="#f45c04">mdi-flag</v-icon>
          <br />
          <h3>Promociones</h3>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <v-card
          class="ma-0 text-center pt-3 rounded-lg"
          elevation="5"
          :to="`/menu/cumpleaneros/${this.$route.params.id}`"
        >
          <v-icon size="100" color="#f45c04">mdi-cake-layered</v-icon>
          <br />
          <h3>Cumpleañeros</h3>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <v-card
          class="ma-0 text-center pt-3 rounded-lg"
          elevation="5"
          :to="`/menu/fechaespecial/${this.$route.params.id}`"
        >
          <v-icon size="100" color="#f45c04">mdi-balloon</v-icon>
          <br />
          <h3>Eventos</h3>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <v-card
          class="ma-0 text-center pt-3 rounded-lg"
          elevation="5"
          :to="`/menu/todocomer/${this.$route.params.id}`"
        >
          <v-icon size="100" color="#f45c04">mdi-silverware-clean</v-icon>
          <br />
          <h3>All can you eat</h3>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="9">
        <h3>Categorías</h3>
        <v-subheader>
          Las categorías son las secciones de su menú, por ejemplo: Entradas,
          Hamburguesas, Postres...|
        </v-subheader>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn left rounded color="#f45c04" dark @click="agregarCategoria">
          <v-icon large left>mdi-plus</v-icon>
          Agregar Categoría
        </v-btn>
      </v-col>
    </v-row>
    <!--  <v-row v-for="n in 5" :key="n">
      <v-col cols="12">
        <v-card outlined>
          <v-row justify="center" align="center" class="px-4">
            <v-icon>mdi-menu</v-icon>
            <h3>Platos Típicos</h3>
            <v-spacer></v-spacer>
            <v-btn text>Ver items</v-btn>
            <v-btn icon><v-icon>mdi-pencil</v-icon></v-btn>
            <v-switch></v-switch>
          </v-row>
        </v-card>
      </v-col>
    </v-row> -->

    <v-row v-for="catC in categoriasC" :key="catC.idTipoProductoComercio">
      <v-col cols="12">
        <v-card outlined>
          <v-row justify="center" align="center" class="px-4">
            <v-icon>mdi-menu</v-icon>
            <h3>{{ catC.nombreTipoProducto }}</h3>
            <v-spacer></v-spacer>
            <v-btn text :to="`/menu/items/${idC}`">Ver items</v-btn>
            <v-btn icon @click="alertEliminar(catC.idTipoProductoComercio)"
              ><v-icon>mdi-delete</v-icon></v-btn
            >
            <v-btn icon @click="editarCat(catC.idTipoProductoComercio)"
              ><v-icon>mdi-pencil</v-icon></v-btn
            >
            <v-switch
              v-model="catC.estado"
              @change="
                cambiarEstadoCat(catC.idTipoProductoComercio, catC.estado)
              "
              color="#f45c04"
            >
            </v-switch>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="350">
        <v-card>
          <v-card-title class="headline"> Nueva Categoría </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="nombreCat"
                :rules="nombreCatRules"
                label="Nombre"
                required
                outlined
                v-if="mostrarNuevaCat === true"
              ></v-text-field>
              <v-autocomplete
                v-model="categoria"
                :rules="categoriaRules"
                label="Categoría"
                required
                outlined
                :items="categorias"
                item-text="nombreTipoProducto"
                item-value="idTipoProducto"
                v-if="mostrarNuevaCat === false"
                @change="mostrarFormCategoria"
              >
              </v-autocomplete>
              <!--  <v-autocomplete
                outlined
                label="Ícono"
                :items="iconos2"
                v-model="iconoCat"
                :rules="iconoCatRules"
                v-if="mostrarNuevaCat === true"
              >
                <template slot="selection" slot-scope="{ item }">
                  <v-icon> {{ item }} </v-icon>
                </template>
                <template slot="item" slot-scope="{ item }">
                  <v-icon> {{ item }} </v-icon>
                </template>
              </v-autocomplete> -->
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red"
              text
              @click="eliminarCat()"
              v-if="editando === true"
            >
              <v-icon left>mdi-delete</v-icon>
              Eliminar
            </v-btn>
            <v-btn text @click="cerrarDialog"> Cancelar </v-btn>
            <v-btn
              color="#f45c04"
              @click="registrarCategoriaComercio()"
              v-if="mostrarNuevaCat === false"
              dark
            >
              Guardar
            </v-btn>
            <v-btn
              color="#f45c04"
              @click="registrarCategoria()"
              v-if="mostrarNuevaCat === true"
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
  name: 'categorias',
  layout: 'restaurantePage',
  data: () => ({
    idtpc: 0,
    valid: true,
    error: false,
    editando: false,
    error_msg: '',
    dialog: false,
    categoria: null,
    categoriaRules: [(v) => !!v || 'Categoría es requerido'],
    nombreCat: '',
    nombreCatRules: [(v) => !!v || 'Nombre de categoría es requerido'],
    iconoCat: '',
    iconoCatRules: [(v) => !!v || 'Icono de categoría es requerido'],
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
    idC: 0,
    categoriasC: [],
    categorias: [],
    mostrarNuevaCat: false,
    auxEstado: true,
  }),
  async mounted() {
    // id Comercio
    this.idC = this.$route.params.id

    // Categorías del comercio
    const cc = await axios.get(
      env.endpoint + '/tipoProductoComercio.php?id=' + this.idC
    )

    if (cc.data.data === false) {
      this.categoriasC = []
    } else {
      this.categoriasC = cc.data.data.filter((a) => a.estado !== 3)
    }

    // this.categoriasC = cc.data.data.filter((a) => a.estado !== 3)
    /* this.categoriasC.splice(0, 0, {
      idTipoProductoComercio: 0,
      nombreTipoProducto: 'Otro',
    }) */

    if (this.categoriasC !== false) {
      this.formatearEstadoCategoria()
    } else {
      this.categoriasC = []
    }
    // Categorías
    const c = await axios.get(env.endpoint + '/tipoProducto.php')
    this.categorias = c.data.data

    this.categorias.splice(0, 0, {
      idTipoProducto: 0,
      nombreTipoProducto: 'Otro',
    })
  },
  methods: {
    agregarCategoria() {
      this.dialog = true
    },
    async registrarCategoriaComercio() {
      if (this.$refs.form.validate()) {
        const c = await axios.post(env.endpoint + '/tipoProductoComercio.php', {
          idComercio: this.idC,
          idTipoProducto: this.categoria,
        })

        this.alertRegistrar(c.data.data, c.data.message)

        this.vaciarCat()
        this.cerrarDialog()
        this.actualizarCats()
      }
    },
    async cambiarEstadoCat(ide, es) {
      const x = es === false ? '2' : '1'

      const js = {
        id: ide,
        campo: 'estado',
        dato: Number(x),
      }
      const e = await axios.patch(
        env.endpoint + '/tipoProductoComercio.php',
        js
      )

      this.alertRegistrar(e.data.data, e.data.message)
      this.actualizarCats()

      /* this.error = true
      this.error_msg = e.data.message */

      // Categorías del comercio
      /*  const cc = await axios.get(
        env.endpoint + '/tipoProductoComercio.php?id=' + this.idC
      )

      this.categoriasC = cc.data.data.filter((a) => a.estado === 0)

      this.formatearEstadoCategoria() */
    },
    formatearEstadoCategoria() {
      this.categoriasC.map((a) => {
        const es = a.estado !== 2
        a.estado = es
        return a
      })
    },
    editarCat(id) {
      this.dialog = true
      this.editando = true
      const ca = this.categoriasC.filter(
        (a) => a.idTipoProductoComercio === id
      )[0]
      this.idtpc = ca.idTipoProductoComercio
      this.categoria = ca.idTipoProducto
      this.auxEstado = ca.estado
    },
    mostrarFormCategoria(id) {
      this.mostrarNuevaCat =
        id === 0 ? !this.mostrarNuevaCat : this.mostrarNuevaCat
    },
    cerrarDialog() {
      this.dialog = false

      this.mostrarNuevaCat = false
    },
    vaciarCat() {
      this.idtpc = null
      this.categoria = null
      this.auxEstado = null
    },
    async guardarEditado(id) {
      if (this.$refs.form.validate()) {
        const c = await axios.put(env.endpoint + '/tipoProductoComercio.php', {
          id: this.idtpc,
          idComercio: this.idC,
          idTipoProducto: this.categoria,
          observaciones: 'Sin Observaciones',
          estado: this.auxEstado,
        })

        this.alertRegistrar(c.data.data, c.data.message)

        this.vaciarCat()
        this.cerrarDialog()
        this.actualizarCats()

        /*  this.error = true
        this.error_msg = c.data.message

        const a = await axios.get(
          env.endpoint + '/tipoProductoComercio.php?id=' + this.idC
        )
        this.categoriasC = null
        this.categoriasC = a.data.data.filter((a) => a.estado === 0)

        this.cerrarDialog() */
      }
    },
    async registrarCategoria() {
      if (this.$refs.form.validate()) {
        const c = await axios.post(env.endpoint + '/tipoProducto.php', {
          nombreTipoProducto: this.nombreCat,
          icono: this.iconoCat,
        })

        this.alertRegistrar(c.data.data, c.data.message)

        this.vaciarCat()
        this.cerrarDialog()
        this.actualizarCats()
      }

      /*
      this.error = true
      this.error_msg = c.data.message

      const a = await axios.get(env.endpoint + '/tipoProducto.php')
      this.categorias = a.data.data
      this.cerrarDialog() */
    },
    eliminarCat() {
      this.alertEliminar(this.idtpc)
      this.cerrarDialog()
      this.actualizarCats()
    },
    async actualizarCats() {
      const id = this.$route.params.id
      let data = (
        await axios.get(env.endpoint + '/tipoProductoComercio.php?id=' + id)
      ).data.data

      if (data === false) {
        this.categoriasC = []
      } else {
        data = data.map((a) => {
          const es = a.estado !== 2
          a.estado = es
          return a
        })

        this.categoriasC = data.filter((a) => a.estado !== 3)
      }
    },
    alertRegistrar(respuesta, mensaje) {
      const ico = respuesta === true ? 'success' : 'error'
      this.$swal({ icon: ico, title: mensaje, confirmButtonColor: '#f45c04' })
    },
    alertEliminar(ide) {
      this.$swal({
        title: '¿Desea Eliminar la Categoría?',
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
            env.endpoint + '/tipoProductoComercio.php',
            js
          )

          this.alertRegistrar(e.data.data, e.data.message)
          this.actualizarCats()
        }
      })
    },
  },
}
</script>

<style></style>
