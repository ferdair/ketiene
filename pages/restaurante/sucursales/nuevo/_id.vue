<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h3>Registrar Nueva Sucursal</h3>
      </v-col>

      <v-col>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row justify="start" align="start">
            <v-col cols="8">
              <v-text-field
                v-model="etqSucursal"
                outlined
                :rules="etqSucursalRules"
                label="Etiqueta de la Sucursal"
                hint="Ejemplo: Sucursal Centro"
              >
              </v-text-field>
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
                      v-model="checkboxAmericanExpress"
                      label="American Express"
                      color="#f45c04"
                    >
                    </v-checkbox>
                    <v-checkbox
                      v-model="checkboxDinnersClub"
                      label="Dinners Club"
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
              <!-- <v-row>
                <v-col cols="12" md="2">
                  <h5>Estado Sucursal</h5>
                  <v-switch v-model="estado" inset color="green"></v-switch>
                </v-col>
              </v-row> -->
            </v-col>

            <v-col cols="12">
              <v-row justify="center">
                <v-btn
                  color="red"
                  text
                  @click="alertEliminar()"
                  v-if="tipoSucur !== 0"
                  ><v-icon>mdi-delete</v-icon> Eliminar</v-btn
                >
                <v-btn color="#f45c04" dark @click="registrar">Guardar</v-btn>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import env from '@/config/env'
export default {
  name: 'sucursales',
  layout: 'restaurantePage',
  data: () => ({
    tipoSucur: 0,
    estado: true,
    etqSucursal: '',
    etqSucursalRules: [(v) => !!v || 'Etiqueta es requerido'],
    mostrarEtiqueta: false,
    valid: true,
    id: 0,
    idSucur: null,
    idSu: 0,
    sucursales: [],
    provincias: [],
    provincia: null,
    provinciaRules: [(v) => !!v || 'Provincia es requerido'],
    ciudades: [],
    auxCiudades: [],
    ciudad: null,
    ciudadRules: [(v) => !!v || 'Logo es requerido'],
    direccion: '',
    direccionRules: [(v) => !!v || 'Dirección es requerido'],
    center: { lat: 0.1, lng: -78 },
    markers: [],
    places: [],
    currentPlace: null,
    telefono: '',
    telefonoRules: [
      (v) => !!v || 'Telefono es requerido',
      (v) => /^([0-9])*$/.test(v) || 'El teléfono debe ser válido',
      (v) => (v || '').length === 10 || 'El teléfono debe tener 10 caracteres',
    ],
    whatsapp: '',
    whatsappRules: [
      (v) => !!v || 'Whatsapp es requerido',
      (v) => /^([0-9])*$/.test(v) || 'El Whatsapp debe ser válido',
      (v) => (v || '').length === 10 || 'El Whatsapp debe tener 10 caracteres',
    ],
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
    envio: null,
    costoEnvio: null,
    checkboxEfectivo: true,
    checkboxTransferencia: false,
    checkboxTarjetas: false,
    checkboxVisa: false,
    checkboxMastercard: false,
    checkboxAmericanExpress: false,
    checkboxDinnersClub: false,
    checkboxDebito: false,
    idKeMas: null,
  }),
  async mounted() {
    this.id = this.$route.params.id
    this.geolocate()

    // AUXILIAR
    const aux = await axios.get(env.endpoint + '/auxiliarComercio.php')

    // PROVINCIAS
    this.provincias = aux.data.data[0].provincia

    // CIUDADES
    this.auxCiudades = aux.data.data[0].ciudad
  },
  methods: {
    geolocate() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
      })
    },

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
        this.places.splice(0, 1, this.currentPlace)
        this.center = marker
        this.currentPlace = null
      }
    },

    setCiudades() {
      this.ciudades = this.auxCiudades.filter(
        (e) => e.provincia === this.provincia
      )
    },
    registrar() {
      if (this.$refs.form.validate()) {
        const ws = this.whatsapp

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

        if (this.checkboxAmericanExpress === true) {
          t += '1'
        } else {
          t += '0'
        }

        if (this.checkboxDinnersClub === true) {
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

        km = km.slice(0, -2)

        /* const etsu = this.sucursales.filter(
          (a) => a.idSucursal === this.sucursal
        )[0].etiquetaSucursal */

        /*  const kmas = this.sucursales.filter(
          (a) => a.idSucursales === this.sucursal
        )[0].keMasTiene[0].idKeMas */

        /* const es = es !== 2
        this.estado = es */

        this.jsonenv = {
          idComercio: this.id,
          etiquetaSucursal: this.etqSucursal,
          direccion: this.direccion,
          geolocalizacion:
            this.markers[0].position.lat + '||' + this.markers[0].position.lng,
          llamadasLocal: this.telefono,
          whatsappLocal: ws,
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
        /* this.jsonenv = {
          idSucursal: Number(this.idSu),
          idComercio: Number(this.$route.params.id),
          idKeMasTiene: this.idKeMas, // DEBERIA CAMBIAR
          orden: 1,
          tipoSucursal: this.tipoSucur,
          estadoSucursal: es,
          etiquetaSucursal: this.etqSucursal,
          direccion: this.direccion,
          geolocalizacion:
            this.markers[0].position.lat + '||' + this.markers[0].position.lng,
          llamadasLocal: this.telefono,
          whatsappLocal: ws,
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
        } */

        this.enviarJson()

        /*  this.jsonenv = {
          nombreComercio: this.nombre,
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
        } */
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
      const j = await axios.post(env.endpoint + '/sucursales.php', this.jsonenv)

      /* if (j.data.code === 200) {
        this.error = true
        this.error_msg = 'Se registró correctamente'

        this.$router.push({
          path: `/restaurante/${j.data.data.idComercio}`,
        })
      } */
      const boo = j.data.code === 200

      this.alertRegistrar(boo, j.data.message)
      this.$router.push({
        path: `/restaurante/${this.id}`,
      })
    },
    alertar() {
      return isNaN(this.envio)
    },

    alertRegistrar(respuesta, mensaje) {
      const ico = respuesta === true ? 'success' : 'error'
      this.$swal({ icon: ico, title: mensaje, confirmButtonColor: '#f45c04' })
    },
    alertEliminar() {
      this.$swal({
        title: '¿Desea Eliminar la Sucursal?',
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
            tabla: 'sucursales',
            id: this.idSu,
            campo: 'estado',
            dato: 3,
          }
          const e = await axios.patch(env.endpoint + '/sucursales.php', js)

          this.alertRegistrar(e.data.data, e.data.message)
        }
      })
    },
  },
}
</script>
