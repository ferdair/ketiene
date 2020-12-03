<template>
  <v-container>
    <v-row>
      <v-col>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row justify="start" align="start">
            <v-col cols="12" md="10">
              <v-autocomplete
                :items="tiposRestaurantes"
                item-text="nombreTipoComercio"
                item-value="id_tipoComercio"
                label="Tipo de Restaurante"
                v-model="tipoRestaurante"
                outlined
                :rules="tipoRestauranteRules"
                @change="abrirDialog"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="2">
              <h5>Estado Restaurante</h5>
              <v-switch v-model="estado" inset color="green"></v-switch>
            </v-col>
            <v-col cols="12" md="5">
              <v-text-field
                label="Nombre"
                outlined
                v-model="nombre"
                :rules="nombreRules"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="5">
              <v-text-field
                label="Identificador único"
                outlined
                :rules="identificadorRules"
                required
                v-model="identificador"
                :hint="hintId"
                @input="hint"
                @change="validarIdentificador"
                :error="errorField"
                :error-messages="errorMsgField"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="10">
              <v-text-field
                label="Eslogan"
                outlined
                :rules="esloganRules"
                required
                v-model="eslogan"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="5">
              <v-file-input
                accept="image/*"
                label="Logo"
                v-model="logo"
                @change="urlLogo"
                :clearable="false"
                outlined
              ></v-file-input>
              <div class="d-flex justify-center">
                <v-img :src="logoUrl" max-height="150" max-width="250" contain>
                </v-img>
              </div>
            </v-col>
            <v-col cols="12" md="5">
              <v-file-input
                accept="image/*"
                label="Banner"
                v-model="banner"
                @change="urlBanner"
                :clearable="false"
                outlined
              ></v-file-input>
              <div class="d-flex justify-center">
                <v-img
                  :src="bannerUrl"
                  max-height="150"
                  max-width="250"
                  contain
                >
                </v-img>
              </div>
            </v-col>
            <v-col cols="12" md="5">
              <v-text-field
                label="Nombre Propietario"
                outlined
                :rules="nombrePRules"
                required
                v-model="nombreP"
              ></v-text-field>
              <v-text-field
                label="Telefono Propietario"
                outlined
                :rules="telPRules"
                required
                v-model="telP"
                :counter="10"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-checkbox
                v-model="checkboxAtencionLocal"
                label="Atención en el local"
                color="#f45c04"
              >
              </v-checkbox>
              <v-checkbox
                v-model="checkboxDomicilio"
                label="A domicilio"
                color="#f45c04"
              >
              </v-checkbox>
              <v-checkbox
                v-model="checkboxLlevar"
                label="Para llevar"
                color="#f45c04"
              >
              </v-checkbox>
            </v-col>
            <v-col cols="12">
              <v-btn text depressed :to="`/restaurante/${this.id}`">
                Regresar
              </v-btn>
              <v-btn color="#f45c04" dark @click="registrar">
                Editar Restaurante
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="350">
        <v-card>
          <v-card-title class="headline">
            Registre un tipo de restaurante
          </v-card-title>
          <v-card-text>
            <v-form ref="form2" v-model="valid2" lazy-validation>
              <v-text-field
                v-model="nombreTipoRestaurante"
                :rules="ntrRules"
                label="Nombre del tipo de restaurante"
                required
                outlined
              ></v-text-field>
              <v-text-field
                v-model="observacionesntr"
                :rules="observacionesntrRules"
                label="Observaciones"
                required
                outlined
              >
              </v-text-field>
              <v-autocomplete
                outlined
                label="icono"
                :items="iconos2"
                v-model="iconontr"
                :rules="iconontrRules"
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
            <v-btn color="green darken-1" text @click="dialog = false">
              Cancelar
            </v-btn>
            <v-btn color="green darken-1" text @click="registrarTipo">
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
  name: 'NuevoRestaurante',
  layout: 'restaurantePage',
  data() {
    return {
      id: null,
      estado: true,
      dialog: false,
      valid: true,
      valid2: true,
      error: false,
      error_msg: '',
      tiposRestaurantes: [],
      tipoRestaurante: null,
      tipoRestauranteRules: [
        (v) => !!v || 'El tipo de restaurante es requerido',
      ],
      nombre: '',
      nombreRules: [(v) => !!v || 'Nombre es requerido'],
      identificador: '',
      identificadorRules: [
        (v) => !!v || 'Identificador único es requerido',
        (v) =>
          /^[a-z0-9_-]{3,16}$/.test(v) || 'El identificador debe ser válido',
      ],
      hintId:
        'Minúsculas y sin espacios. Su dirección web será ketiene.com/ejemplo. Si cambia el identificador, los QR deberan ser reimpresos',
      nombreP: '',
      nombrePRules: [(v) => !!v || 'Nombre del Propietario es requerido'],
      eslogan: '',
      esloganRules: [(v) => !!v || 'Eslogan es requerido'],
      telP: '',
      telPRules: [
        (v) => !!v || 'Telefono es requerido',
        (v) => /^([0-9])*$/.test(v) || 'El teléfono debe ser válido',
        (v) =>
          (v || '').length === 10 || 'El teléfono debe tener 10 caracteres',
      ],
      logo: null,
      logoRules: [(v) => !!v || 'Logo es requerido'],
      auxlogoUrl: null,
      logoUrl: null,
      logoUpload: null,
      banner: null,
      bannerRules: [(v) => !!v || 'Logo es requerido'],
      bannerUrl: null,
      auxbannerUrl: null,
      bannerUpload: null,
      checkboxAtencionLocal: true,
      checkboxDomicilio: false,
      checkboxLlevar: false,
      nombreTipoRestaurante: '',
      ntrRules: [
        (v) => !!v || 'El nombre del tipo de restaurante es requerido',
      ],
      jsonenv: null,
      errorField: false,
      errorMsgField: '',
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
      observacionesntr: '',
      observacionesntrRules: [(v) => !!v || 'Observaciones es requerido'],
      iconontr: '',
      iconontrRules: [(v) => !!v || 'El icono es requerido'],
    }
  },
  methods: {
    hint() {
      this.hintId =
        'Minúsculas y sin espacios. Su dirección web será ketiene.com/' +
        this.identificador +
        '. Si cambia el identificador, los QR deberan ser reimpresos'
    },
    urlLogo() {
      if (this.logo) {
        this.logoUrl = URL.createObjectURL(this.logo)
      } else {
        this.logo = null
      }
    },
    urlBanner() {
      if (this.banner) {
        this.bannerUrl = URL.createObjectURL(this.banner)
      } else {
        this.banner = null
      }
    },
    setCiudades() {
      this.ciudades = this.auxCiudades.filter(
        (e) => e.provincia === this.provincia
      )
    },
    async registrar() {
      if (this.$refs.form.validate()) {
        const ws = '+593' + this.telP.slice(1)

        // OPCIONES
        let op = ''

        if (this.checkboxAtencionLocal === true) {
          op += '1'
        } else {
          op += '0'
        }

        if (this.checkboxDomicilio === true) {
          op += '1'
        } else {
          op += '0'
        }

        if (this.checkboxLlevar === true) {
          op += '1'
        } else {
          op += '0'
        }

        if (this.estado === true) {
          this.estado = 0
        } else {
          this.estado = 1
        }

        this.jsonenv = {
          id: Number(this.$route.params.id),
          nombre: this.nombre,
          eslogan: this.eslogan,
          whatsappPropietario: ws,
          llamadasPropietario: this.telP,
          nombrePropietario: this.nombreP,
          idTipoComercio: this.tipoRestaurante,
          opciones: op,
          identificador: this.identificador,
          observaciones: '',
          estado: this.estado,
        }

        if (this.logo === null) {
          this.jsonenv.imagenLogo = this.auxlogoUrl
        } else {
          await this.subirImagen('logos', this.logo)
        }

        if (this.banner === null) {
          this.jsonenv.imagenPortada = this.auxbannerUrl
        } else {
          await this.subirImagen('banners', this.banner)
        }

        alert(JSON.stringify(this.jsonenv))

        if (this.jsonenv.imagenPortada && this.jsonenv.imagenLogo) {
          this.enviarJson()
        }
      }
    },
    abrirDialog() {
      if (this.tipoRestaurante === 'Otro') {
        this.dialog = true
      }
    },
    async registrarTipo() {
      const t = {
        nombreTipoComercio: this.nombreTipoRestaurante,
        observaciones: this.observacionesntr,
        icono: this.iconontr,
      }

      const tr = await axios.post(env.endpoint + '/tipoComercio.php', t)

      t.id_tipoComercio = tr.data.data[0].id_tipoComercio

      this.tiposRestaurantes.splice(0, 0, t)
      this.tipoRestaurante = t.id_tipoComercio

      this.dialog = false
    },
    subirImagen(nombrec, file) {
      const nombre = Date.now()
      /*eslint-disable */
      var storageRef = this.$fireModule
        .storage()
        .ref()
        .child(`${nombrec}/${nombre}`)

      var uploadTask = storageRef.put(file)
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
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            /*eslint-disable */
            // console.log('File available at', downloadURL)
            // console.log(downloadURL)
            /* eslint-enable */
            if (nombrec === 'logos') {
              this.jsonenv.imagenLogo = downloadURL

              /*  if (this.jsonenv.imagenPortada) {
                this.enviarJson()
              } */
            } else {
              this.jsonenv.imagenPortada = downloadURL

              /*  if (this.jsonenv.imagenLogo) {
                this.enviarJson()
              } */
            }
            //            this.picture = downloadURL
          })
        }
      )
    },
    async validarIdentificador() {
      const val = await axios.get(
        env.endpoint + '/validarId.php?identificador=' + this.identificador
      )

      if (val.data.data[0].contador > 0) {
        this.errorField = true
        this.errorMsgField = 'El identificador ya está ocupado'
      } else {
        this.errorField = false
        this.errorMsgField = ''
      }
    },
    agregarKmas() {
      this.kmasTiene.splice(this.kmasTiene.length, 0, {
        icono: this.kmasIcono,
        detalle: this.kmasDetalle,
      })
    },
    quitarKemas(i) {
      this.kmasTiene.splice(i, 1)
    },
    async enviarJson() {
      const j = await axios.put(
        env.endpoint + '/datosComercio.php',
        this.jsonenv
      )

      if (j.data.code === 200) {
        this.error = true
        this.error_msg = 'Se registró correctamente'

        this.$router.push({
          path: `/restaurante/${this.id}`,
        })
      }
    },
    alertar() {
      return isNaN(this.envio)
    },
  },
  async mounted() {
    this.id = Number(this.$route.params.id)

    // AUXILIAR
    const aux = await axios.get(env.endpoint + '/auxiliarComercio.php')

    // TIPOS DE RESTAURANTES
    this.tiposRestaurantes = aux.data.data[0].tipoComercio

    this.tiposRestaurantes.splice(0, 0, { nombreTipoComercio: 'Otro' })

    // PROVINCIAS
    this.provincias = aux.data.data[0].provincia

    // CIUDADES
    this.auxCiudades = aux.data.data[0].ciudad

    // DATOS COMERCIO
    const com = await axios.get(
      env.endpoint + '/datosComercio.php?id=' + this.id
    )

    this.tipoRestaurante = com.data.data[0].idTipoComercio
    this.nombre = com.data.data[0].nombre
    this.identificador = com.data.data[0].identificador
    this.nombreP = com.data.data[0].nombrePropietario
    this.eslogan = com.data.data[0].eslogan
    this.telP = com.data.data[0].llamadasPropietario
    this.logoUrl = com.data.data[0].imagenLogo
    this.auxlogoUrl = com.data.data[0].imagenLogo
    this.bannerUrl = com.data.data[0].imagenPortada
    this.auxbannerUrl = com.data.data[0].imagenPortada
    this.checkboxAtencionLocal = com.data.data[0].opciones[0]
    this.checkboxDomicilio = com.data.data[0].opciones[1]
    this.checkboxLlevar = com.data.data[0].opciones[2]

    this.estado = !com.data.data[0].sucursales[0].estado
  },
}
</script>

<style></style>
