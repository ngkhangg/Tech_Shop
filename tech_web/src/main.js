import { createApp } from 'vue'
import App from './App.vue'
import FontAwesomeIcon from "./fontawesome";
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import "@fortawesome/fontawesome-free/css/all.min.css";
import router from './router';


const app = createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(router);
app.mount("#app");