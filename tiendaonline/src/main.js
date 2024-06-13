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
import RegistroDeUsuario from './components/RegistroDeUsuario.vue';
import MiCuenta from './components/MiCuenta.vue';
import CarritoDeCompras from './components/CarritoDeCompras.vue';
import CrearCamiseta from './components/CrearCamiseta.vue';
import SubirImagenes from './components/SubirImagenes.vue';
import EditarCamiseta from './components/EditarCamiseta.vue';
import GestionDeUsuarios from './components/GestionDeUsuarios.vue';
import VerReseñas from './components/VerReseñas.vue';
import { jwtDecode } from 'jwt-decode';
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
  { path: '/registro', component: RegistroDeUsuario },
  { path: '/MiCuenta', component: MiCuenta },
  { path: '/Carrito', component: CarritoDeCompras },
  { path: '/crear-camiseta', component: CrearCamiseta, meta: { roles: ['admin']} },
  {path: '/subir-imagenes/:idCamiseta',component: SubirImagenes,props: true,meta: { roles: ['admin']} },
  { path: '/editar-camiseta/:id', component: EditarCamiseta, props: true,meta: { roles: ['admin']}  }, //El campo Meta es para especificar los roles permitidos
  {path:'/gestion-de-Cuentas',component:GestionDeUsuarios,meta: { roles: ['admin']} },
  {path:'/ver-resenas',component:VerReseñas}
];


// Crear una instancia de router
const router = createRouter({
  history: createWebHistory(),
  routes,
  // Habilitar reutilización de componentes
  reuseNavigationHistory: true,
});

// Guard de navegación global
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const userRole = token ? jwtDecode(token).role : null;

  if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    next('/home'); // Redirigir a home si no tiene el rol 
  } else {
    next(); // Continuar a la ruta
  }
});


// Crear la aplicación Vue
const app = createApp(App);

// Usar el router en la aplicación
app.use(router);
app.use(Quasar, quasarUserOptions);

// Montar la aplicación
app.mount('#app');