<template>
  <v-app id="inspire">
    <span class="bg"></span>
    <v-row align="center" justify="center">
      <v-col cols="10">
        <v-row class="d-flex justify-center align-stretch">
          <v-col cols="12" md="6" xl="8" class="text-center">
            <v-card width="400" class="mx-auto mt-5 login pa-5">
              <v-img
                :src="require('@/static/ketiene-color.svg')"
                max-height="100"
                contain
              >
              </v-img>
              <v-card-title class="pb-0 text-center">
                <h2>Iniciar Sesión</h2>
              </v-card-title>
              <v-text-field
                v-model="login.correo"
                :rules="correoRules"
                label="E-mail"
                prepend-icon="mdi-account-circle"
                type="email"
                required
                color="#f45c04"
              ></v-text-field>
              <v-text-field
                v-model="login.clave"
                :type="showPassword ? 'text' : 'password'"
                label="Contraseña"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                color="#f45c04"
              />
              <v-card-actions>
                <v-btn block color="#f45c04" dark @click="userLogin">
                  ENTRAR
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar">
      {{ error_msg }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
    <Footer></Footer>
  </v-app>
</template>

<script>
import Footer from '@/components/footer'

export default {
  name: 'Login',
  components: {
    Footer,
  },
  data() {
    return {
      snackbar: false,
      login: {
        correo: '',
        clave: '',
      },
      error: false,
      error_msg: '',
      showPassword: false,
      correoRules: [
        (v) => !!v || 'Correo es requerido',
        (v) => /.+@.+\..+/.test(v) || 'El correo debe ser válido',
      ],
    }
  },
  methods: {
    async userLogin() {
      try {
        const {
          data: {
            data: [data],
          },
        } = await this.$auth.loginWith('local', {
          data: this.login,
        })

        this.$auth.setUser(data)
        this.$auth.$storage.setUniversal('user', data, true)
      } catch (error) {
        this.snackbar = true
        this.error_msg = 'No se pudo iniciar sesión'
      }
    },
  },
}
</script>

<style scoped>
.login {
  border-radius: 10%;
}
.bg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: url('https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg')
    no-repeat center center;
  /*     background: url('~@/static/3.png') no-repeat center center;
 */
  background-size: cover;
  background-color: #d0d0d0;
  transform: scale(1.1);
}
</style>
