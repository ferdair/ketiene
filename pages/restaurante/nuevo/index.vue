<template>
  <v-container>
    <v-row>
      <v-col>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row justify="start" align="start">
            <v-col cols="12">
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
              <!-- <v-select
              :items="tiposRestaurantes"
              item-text="nombreTipoComercio"
              item-value="id_tipoComercio"
              label="Agregar producto"
              v-model="tipoRestaurante"
              outlined
            ></v-select> -->
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                label="Nombre"
                outlined
                v-model="nombre"
                :rules="nombreRules"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
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
            <v-col cols="12" md="4">
              <v-text-field
                label="Nombre Propietario"
                outlined
                :rules="nombrePRules"
                required
                v-model="nombreP"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="8">
              <v-text-field
                label="Eslogan"
                outlined
                :rules="esloganRules"
                required
                v-model="eslogan"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
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
              <v-file-input
                accept="image/*"
                label="Logo"
                v-model="logo"
                @change="urlLogo"
                :clearable="false"
                outlined
                :rules="logoRules"
              ></v-file-input>
              <div class="d-flex justify-center">
                <v-icon v-if="logo === null">mdi-camera-plus</v-icon>
                <v-img
                  v-else
                  :src="logoUrl"
                  max-height="150"
                  max-width="250"
                  contain
                >
                </v-img>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <v-file-input
                accept="image/*"
                label="Banner"
                v-model="banner"
                @change="urlBanner"
                :clearable="false"
                outlined
                :rules="bannerRules"
              ></v-file-input>
              <div class="d-flex justify-center">
                <v-icon v-if="banner === null">mdi-camera-plus</v-icon>
                <v-img
                  v-else
                  :src="bannerUrl"
                  max-height="150"
                  max-width="250"
                  contain
                >
                </v-img>
              </div>
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
            <v-col cols="12" class="pa-0">
              <h2>Datos del Local Matriz</h2>
            </v-col>
            <v-col cols="12" md="8">
              <v-row>
                <h4>Ubicación</h4>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-autocomplete
                    :items="provincias"
                    item-text="nombreProv"
                    item-value="id_provincia"
                    label="Provincia"
                    v-model="provincia"
                    outlined
                    @change="setCiudades"
                    :rules="provinciaRules"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete
                    :items="ciudades"
                    item-text="nombreCiu"
                    item-value="id_ciudad"
                    label="Ciudad"
                    v-model="ciudad"
                    outlined
                    :rules="ciudadRules"
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-col cols="12" class="pa-0">
                <v-text-field
                  label="Dirección"
                  outlined
                  v-model="direccion"
                  :rules="direccionRules"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <h2>Buscar y agregar un pin</h2>
                <GmapAutocomplete
                  class="outlined v-autocomplete"
                  @place_changed="setPlace"
                  :options="{
                    fields: [
                      'geometry',
                      'formatted_address',
                      'address_components',
                    ],
                  }"
                >
                </GmapAutocomplete>
                <v-btn @click="addMarker">Añadir Marcador</v-btn>

                <GmapMap
                  :center="center"
                  :zoom="12"
                  map-type-id="roadmap"
                  style="width: 100%; height: 400px"
                >
                  <GmapMarker
                    :key="index"
                    v-for="(m, index) in markers"
                    :position="m.position"
                    :clickable="true"
                    :draggable="true"
                    @click="center = m.position"
                  />
                </GmapMap>
              </v-col>
              <v-row>
                <v-col cols="12" md="6">
                  <h3>Telefono</h3>
                  <!-- <v-checkbox
                  v-model="checkboxTelefono"
                  label="Mostrar Telefono"
                  color="#f45c04"
                ></v-checkbox> -->
                  <v-text-field
                    label="telefono"
                    outlined
                    v-model="telefono"
                    :rules="telefonoRules"
                    :counter="10"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <h3>Whatsapp</h3>
                  <!--   <v-checkbox
                  v-model="checkboxWs"
                  label="Mostrar Whatsapp"
                  color="#f45c04"
                ></v-checkbox> -->
                  <v-text-field
                    label="Whatsapp"
                    outlined
                    hint="Con número de área"
                    v-model="whatsapp"
                    :rules="whatsappRules"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <h2>Horarios de Atención Matriz</h2>
              </v-row>
              <v-row v-for="(horario, i) in horarios" :key="i">
                <v-col cols="12" md="4">
                  <v-checkbox
                    v-model="horario.valor"
                    :label="horario.dia"
                    color="#f45c04"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" md="8" v-if="horario.valor">
                  <!--  <v-range-slider
                  hint="Hora de atención"
                  max="24"
                  min="0"
                  thumb-label="always"
                  thumb-color="#f45c04"
                  v-model="horario.hora"
                  track-color="orange"
                  color="#f45c04"
                  step="0.1"
                ></v-range-slider> -->
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        type="time"
                        v-model="horario.hora[0]"
                        color="#f45c04"
                        :rules="horarioRules"
                      ></v-text-field
                    ></v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        type="time"
                        v-model="horario.hora[1]"
                        color="#f45c04"
                        :rules="horarioRules"
                      ></v-text-field
                    ></v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row>
                <h3>Ke más tiene</h3>
              </v-row>
              <v-row
                v-for="(kmas, i) in kmasTiene"
                :key="i"
                justify="center"
                align="center"
              >
                <v-icon>{{ kmas.icono }}</v-icon>
                <v-spacer></v-spacer>
                {{ kmas.detalle }}
                <v-spacer></v-spacer>
                <v-btn depressed @click="quitarKemas(i)"
                  ><v-icon left>mdi-delete</v-icon></v-btn
                >
              </v-row>
              <v-row>
                <v-col cols="12" md="2">
                  <v-autocomplete
                    outlined
                    label="icono"
                    :items="iconos"
                    v-model="kmasIcono"
                  >
                    <template slot="selection" slot-scope="{ item }">
                      <v-icon> {{ item }} </v-icon>
                    </template>
                    <template slot="item" slot-scope="{ item }">
                      <v-icon> {{ item }} </v-icon>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Detalle"
                    v-model="kmasDetalle"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="2">
                  <v-btn color="#f45c04" fab large dark @click="agregarKmas">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="4">
              <v-row>
                <v-radio-group v-model="envio" mandatory @change="alertar">
                  <template v-slot:label>
                    <div>Costo de envío</div>
                  </template>
                  <v-radio
                    label="Gratis"
                    value="Gratis"
                    color="#f45c04"
                  ></v-radio>
                  <v-radio
                    label="Lo arreglo con el comprador"
                    value="Lo arreglo con el comprador"
                    color="#f45c04"
                  ></v-radio>
                  <v-radio
                    label="Costo fijo"
                    :value="costoEnvio"
                    color="#f45c04"
                  ></v-radio>
                </v-radio-group>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-if="alertar() === false"
                    type="number"
                    label="Costo"
                    outlined
                    height="12"
                    v-model="costoEnvio"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <h3>Formas de pago</h3>
                  <v-checkbox
                    v-model="checkboxEfectivo"
                    label="Efectivo"
                    color="#f45c04"
                  >
                  </v-checkbox>
                  <v-checkbox
                    v-model="checkboxTransferencia"
                    label="Transferencias"
                    color="#f45c04"
                  >
                  </v-checkbox>
                  <v-checkbox
                    v-model="checkboxTarjetas"
                    label="Tarjetas"
                    color="#f45c04"
                  >
                  </v-checkbox>
                  <v-container v-if="checkboxTarjetas">
                    <v-checkbox
                      v-model="checkboxVisa"
                      label="Visa"
                      color="#f45c04"
                    >
                    </v-checkbox>
                    <v-checkbox
                      v-model="checkboxMastercard"
                      label="Mastercard"
                      color="#f45c04"
                    >
                    </v-checkbox>
                    <v-checkbox
                      v-model="checkboxDebito"
                      label="Debito"
                      color="#f45c04"
                    >
                    </v-checkbox>
                  </v-container>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-btn color="#f45c04" dark @click="registrar"
                >Registrar Restaurante</v-btn
              >
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
  layout: 'adminPage',
  data() {
    return {
      center: { lat: 0.1, lng: -78 },
      markers: [],
      places: [],
      currentPlace: null,
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
      logoUrl: null,
      logoUpload: null,
      banner: null,
      bannerRules: [(v) => !!v || 'Logo es requerido'],
      bannerUrl: null,
      bannerUpload: null,
      checkboxAtencionLocal: true,
      checkboxDomicilio: false,
      checkboxLlevar: false,
      provincias: [],
      provincia: null,
      provinciaRules: [(v) => !!v || 'Provincia es requerido'],
      ciudades: [],
      auxCiudades: [],
      ciudad: null,
      ciudadRules: [(v) => !!v || 'Logo es requerido'],
      direccion: '',
      direccionRules: [(v) => !!v || 'Dirección es requerido'],
      telefono: '',
      telefonoRules: [
        (v) => !!v || 'Telefono es requerido',
        (v) => /^([0-9])*$/.test(v) || 'El teléfono debe ser válido',
        (v) =>
          (v || '').length === 10 || 'El teléfono debe tener 10 caracteres',
      ],
      whatsapp: '',
      whatsappRules: [
        (v) => !!v || 'Whatsapp es requerido',
        (v) => /^([0-9])*$/.test(v) || 'El Whatsapp debe ser válido',
        (v) =>
          (v || '').length === 10 || 'El Whatsapp debe tener 10 caracteres',
      ],
      nombreTipoRestaurante: '',
      ntrRules: [
        (v) => !!v || 'El nombre del tipo de restaurante es requerido',
      ],

      envio: null,
      checkboxEfectivo: true,
      checkboxTransferencia: false,
      checkboxTarjetas: false,
      checkboxVisa: false,
      checkboxMastercard: false,
      checkboxDebito: false,
      horarios: [
        { dia: 'Lunes', valor: false, hora: ['08:00', '20:00'] },
        { dia: 'Martes', valor: false, hora: ['08:00', '20:00'] },
        { dia: 'Miércoles', valor: false, hora: ['08:00', '20:00'] },
        { dia: 'Jueves', valor: false, hora: ['08:00', '20:00'] },
        { dia: 'Viernes', valor: false, hora: ['08:00', '20:00'] },
        { dia: 'Sábado', valor: false, hora: ['08:00', '20:00'] },
        { dia: 'Domingo', valor: false, hora: ['08:00', '20:00'] },
      ],
      horarioRules: [(v) => !!v || 'El horatio es requerido'],
      jsonenv: null,
      errorField: false,
      errorMsgField: '',
      costoEnvio: null,
      kmasIcono: '',
      kmasDetalle: '',
      kmasTiene: [],
      iconos: [
        'mdi-motorbike',
        'mdi-clock-time-four',
        'mdi-check-circle',
        'mdi-account-supervisor-circle',
        'mdi-parking',
        'mdi-bicycle',
        'mdi-paw',
        'mdi-pine-tree',
        'mdi-nintendo-game-boy',
        'mdi-notebook-outline',
      ],
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
    setPlace(place) {
      this.currentPlace = place
    },
    addMarker() {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng(),
        }
        this.markers.splice(0, 1, { position: marker })
        alert(JSON.stringify(this.markers))
        this.places.splice(0, 1, this.currentPlace)
        this.center = marker
        this.currentPlace = null
      }
    },
    geolocate() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
      })
    },
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
        const ws = '+593' + this.whatsapp.slice(1)

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

        // METODOS DE PAGO
        let mp = ''

        if (this.checkboxEfectivo === true) {
          mp += '1'
        } else {
          mp += '0'
        }

        if (this.checkboxTransferencia === true) {
          mp += '1'
        } else {
          mp += '0'
        }

        if (this.checkboxTarjetas === true) {
          mp += '1'
        } else {
          mp += '0'
        }

        // TARJETAS

        let t = ''

        if (this.checkboxVisa === true) {
          t += '1'
        } else {
          t += '0'
        }

        if (this.checkboxMastercard === true) {
          t += '1'
        } else {
          t += '0'
        }

        if (this.checkboxDebito === true) {
          t += '1'
        } else {
          t += '0'
        }

        // DIAS y HORAS

        let d = ''
        const h = []

        this.horarios.forEach((element) => {
          if (element.valor === true) {
            d += '1'
            const ho = element.hora[0] + '-' + element.hora[1]
            h.push(ho)
          } else {
            d += '0'
            h.push('00:00-00:00')
          }
        })

        let km = ''
        this.kmasTiene.forEach((element) => {
          km += element.icono + '||' + element.detalle + '||'
        })

        km.slice(0, -2)

        this.jsonenv = {
          nombreComercio: this.nombre,
          /*  imagenLogo: this.logoUpload,
          imagenPortada: this.bannerUpload, */
          eslogan: this.eslogan,
          whatsappPropietario: ws,
          llamadasPropietario: this.telP,
          nombrePropietario: this.nombreP,
          tipoComercio: this.tipoRestaurante,
          opciones: op,
          identificador: this.identificador,
          direccion: this.direccion,
          geolocalizacion:
            this.markers[0].position.lat + '||' + this.markers[0].position.lng,
          llamadasLocal: this.telefono,
          whatsappLocal: this.whatsapp,
          domicilio: this.envio,
          idCiudad: this.ciudad,
          keMasTiene: km,
          metodosPago: mp,
          tarjetasAceptadas: t,
          dias: d,
          lunes: h[0],
          martes: h[1],
          miercoles: h[2],
          jueves: h[3],
          viernes: h[4],
          sabado: h[5],
          domingo: h[6],
        }

        await this.subirImagen('logos', this.logo)
        await this.subirImagen('banners', this.banner)
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

              if (this.jsonenv.imagenPortada) {
                this.enviarJson()
              }
            } else {
              this.jsonenv.imagenPortada = downloadURL

              if (this.jsonenv.imagenLogo) {
                this.enviarJson()
              }
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
    enviarJson() {
      const j = axios.post(env.endpoint + '/datosComercio.php', this.jsonenv)

      if (j.data.code === 200) {
        this.error = true
        this.error_msg = 'Se registró correctamente'

        this.$router.push({
          path: `/restaurante/${j.data.data.idComercio}`,
        })
      }
    },
    alertar() {
      return isNaN(this.envio)
    },
  },
  async mounted() {
    this.geolocate()

    // ICONOS

    // MAPS
    /*  this.$refs.mapRef.$mapPromise.then((map) => {
      map.panTo({ lat: 1.38, lng: 103.8 })
    })
 */
    // AUXILIAR
    const aux = await axios.get(env.endpoint + '/auxiliarComercio.php')

    // TIPOS DE RESTAURANTES
    this.tiposRestaurantes = aux.data.data[0].tipoComercio

    this.tiposRestaurantes.splice(0, 0, { nombreTipoComercio: 'Otro' })

    // PROVINCIAS
    this.provincias = aux.data.data[0].provincia

    // CIUDADES
    this.auxCiudades = aux.data.data[0].ciudad
  },
}
</script>

<style></style>
