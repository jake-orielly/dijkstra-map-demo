import Vue from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPause, faPlay, faForward } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faPause, faPlay, faForward)

Vue.component('font-awesome-icon', FontAwesomeIcon)

new Vue({
    render: h => h(App),
}).$mount('#app')