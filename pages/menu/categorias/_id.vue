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
            <v-btn icon><v-icon>mdi-pencil</v-icon></v-btn>
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
          <v-card-title class="headline"> Agregar Categoría </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="nombreCat"
                :rules="nombreCatRules"
                label="Nombre de la categoría"
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
              <v-autocomplete
                outlined
                label="icono"
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
              </v-autocomplete>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="cerrarDialog">
              Cancelar
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              @click="registrarCategoriaComercio(categoria)"
              v-if="mostrarNuevaCat === false"
            >
              Agregar
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              @click="registrarCategoria()"
              v-if="mostrarNuevaCat === true"
            >
              Agregar
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
    valid: true,
    error: false,
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
  }),
  async mounted() {
    // id Comercio
    this.idC = this.$route.params.id

    // Categorías del comercio
    const cc = await axios.get(
      env.endpoint + '/tipoProductoComercio.php?id=' + this.idC
    )

    this.categoriasC = cc.data.data /* .filter((a) => a.estado === 0) */
    /* this.categoriasC.splice(0, 0, {
      idTipoProductoComercio: 0,
      nombreTipoProducto: 'Otro',
    }) */
    this.formatearEstadoCategoria()
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
    async cambiarEstadoCat(ide, es) {
      const x = es === false ? '1' : '0'

      const js = {
        id: ide,
        campo: 'estado',
        dato: Number(x),
      }
      const e = await axios.patch(
        env.endpoint + '/tipoProductoComercio.php',
        js
      )

      this.error = true
      this.error_msg = e.data.message

      // Categorías del comercio
      /*  const cc = await axios.get(
        env.endpoint + '/tipoProductoComercio.php?id=' + this.idC
      )

      this.categoriasC = cc.data.data.filter((a) => a.estado === 0)

      this.formatearEstadoCategoria() */
    },
    formatearEstadoCategoria() {
      this.categoriasC.forEach((element) => {
        const e = !element.estado
        element.estado = e
      })
    },
    mostrarFormCategoria(id) {
      this.mostrarNuevaCat =
        id === 0 ? !this.mostrarNuevaCat : this.mostrarNuevaCat
    },
    cerrarDialog() {
      this.dialog = false
      this.mostrarNuevaCat = false
    },
    async registrarCategoriaComercio(id) {
      const c = await axios.post(env.endpoint + '/tipoProductoComercio.php', {
        idComercio: this.idC,
        idTipoProducto: id,
      })

      this.error = true
      this.error_msg = c.data.message

      const a = await axios.get(
        env.endpoint + '/tipoProductoComercio.php?id=' + this.idC
      )
      this.categoriasC = null
      this.categoriasC = a.data.data.filter((a) => a.estado === 0)

      this.cerrarDialog()
    },
    async registrarCategoria() {
      const c = await axios.post(env.endpoint + '/tipoProducto.php', {
        nombreTipoProducto: this.nombreCat,
        icono: this.iconoCat,
      })

      this.error = true
      this.error_msg = c.data.message

      const a = await axios.get(env.endpoint + '/tipoProducto.php')
      this.categorias = a.data.data
      this.cerrarDialog()
    },
  },
}
</script>

<style></style>
