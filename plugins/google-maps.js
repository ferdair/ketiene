import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyC3R9bZtVowogCj74F_-Ys99GsxNmpoxJM',
    libraries: 'places',
  },
})
