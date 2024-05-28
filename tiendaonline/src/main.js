// main.js
import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import NuestrasCamisetas from './components/NuestrasCamisetas.vue';
import FormularioInicio from './components/FormularioInicio.vue';
import ErrorComponent from './components/ErrorComponent.vue';
import quasarUserOptions from './quasar-user-options';
import '@quasar/extras/material-icons/material-icons.css'; 
import CamisetaDetalle from './components/CamisetaDetalle.vue';
import CamisetaPorLiga from './components/CamisetaPorLiga.vue';
import CamisetaPorEquipo from './components/CamisetaPorEquipo.vue';
import { Quasar } from 'quasar'; // Importa Quasar
import 'quasar/dist/quasar.css';
// Configuración de las rutas
const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: NuestrasCamisetas },
  { path: '/mas-vendidas', component: NuestrasCamisetas },
  { path: '/Formulario', component: FormularioInicio },
  { path: '/:pathMatch(.*)*', component: ErrorComponent },
  { path: '/camiseta/:id', component: CamisetaDetalle, props: true },
  { path: '/camisetas/:liga', component: CamisetaPorLiga, props: true },
  { path: '/camisetas/equipo/:equipo', component: CamisetaPorEquipo, props: true },
];

// Crear una instancia de router
const router = createRouter({
  history: createWebHistory(),
  routes,
  // Habilitar reutilización de componentes
  reuseNavigationHistory: true,
});

// Crear la aplicación Vue
const app = createApp(App);

// Usar el router en la aplicación
app.use(router);
app.use(Quasar, quasarUserOptions);

// Montar la aplicación
app.mount('#app');