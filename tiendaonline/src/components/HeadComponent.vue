<template>
    <header id="header">
      <div class="center">
        <!-- LOGO -->
        <div id="logo">
          <img src="../assets/imagenes/logoTienda.png" class="app-logo" alt="Logotipo" />
          <span id="brand" style="font-family: Helvetica; color: white">
            EL RINCON DEL <strong>FUTBOL</strong> ANTIGUO
          </span>
        </div>
        
        <!-- MENU -->
        <nav id="menu">
          <ul>
            <li>
              <router-link to="/home" active-class="active"> 
                <q-btn size="large" flat round icon="home"  style="color:rgba(0, 28, 73, 1);"></q-btn>
              </router-link>
            </li>
            <li v-if="autenticado">
              <q-btn size="large" @click="cerrarSesion" flat round icon="logout"  class="icono"></q-btn>
            </li>
            <li v-if="autenticado">
            <router-link to="/MiCuenta" style="text-decoration:none;">
             <q-btn size="large" flat round icon="account_circle"  class="icono"></q-btn>
            </router-link>
            </li>
            <li v-else>
              <router-link to="/formulario" active-class="active">
                <q-btn size="large" flat round icon="login"  class="icono"></q-btn>
              </router-link>
            </li>
            <li v-if="userRole=='admin'">
              <router-link to="/gestion-de-Cuentas" active-class="active">
              <q-btn size="large" flat round icon="manage_accounts"  class="icono"></q-btn>
              </router-link>
            </li>
            <li >
            <router-link to="/Carrito" style="text-decoration:none;">
             <q-btn size="large" flat round icon="shopping_cart" class="icono"></q-btn>
            </router-link>
            </li>
          </ul>
        </nav>
  
        <!-- LIMPIAR FLOTADOS -->
        <div class="clearfix"></div>
      </div>
    </header>
  </template>
  
  <script>
  import { defineComponent, ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router'; 
  import { jwtDecode } from 'jwt-decode'; 
  import { QBtn } from 'quasar';
  export default defineComponent({
    name: 'HeadComponent',
    components:{
      QBtn
    },
    setup() {

      const userId = ref(null);
    const userRole = ref(null);

     const decodificarToken = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        userId.value = decodedToken.userId;
        userRole.value = decodedToken.role;  
      }
    };

      const router = useRouter();
      const autenticado = ref(false);
  
      const checkToken = () => {
        const token = localStorage.getItem('token');
        autenticado.value = !!token;
      };
  
      const cerrarSesion = () => {
        localStorage.removeItem('token');
        autenticado.value = false;
        router.push('/home');
        window.location.reload();
      };
  
      onMounted(() => {
        checkToken();
        decodificarToken();
      });
  
      return {
        userRole,
        autenticado,
        cerrarSesion,
      };
    },
  });
  </script>
  
  <style scoped>
  
  #header {
    height: 120px;
    width: 100%;
    background: rgb(243, 48, 48);
    border-bottom: 3px solid rgba(0, 28, 73, 1);
    border-top: 5px solid rgba(0, 28, 73, 1);
  }
  .center {
    width: 85%;
    margin: 0px auto;
  }
  #logo {
    width: 40%;
    font-size: 30px;
    float: left;
    margin-top: 35px;
    margin-left: 10%;
  }
  
  #logo img {
    display: block;
    float: left;
    height: 75px;
    margin-top: -9px;
    margin-right: 10px;
    animation: latir infinite 5s linear;
  }
  #menu {
    width: 40%;
    float: right;
    font-size: 18px;
    display: contents;
  }
  
  #menu ul {
    line-height: 85px;
    width: 35%;
    float: left;
    margin-left: 14%;
  }
  
  #menu ul li {
    display: inline-block;
    list-style: none;
    height: 46px;
    margin-left: 15px;
    margin-right: 15px;
  }
  
  #menu a {
    text-decoration: none;
    color: #363636;
    transition: 300ms all;
  }
  
  #menu a:hover {
    color: #fdfdfd;
  }
  
  #menu .active {
    color: #fdfdfd;
  }
  
.icono{
  color:rgba(0, 28, 73, 1)
}

  /*RESPONSIVE*/
  
  /*Desde la anchura 963px hasta la anchura 1488px de pantalla*/
  @media (max-width: 1488px) {
    .center {
      width: 85%;
    }
  }
  
  @media (max-width: 497px) {
    #header {
      min-height: 130px;
      overflow: hidden;
    }
    #menu,
    #menu ul {
      line-height: 50px;
    }
  
    #menu ul li {
      margin-left: 7px;
      margin-right: 7px;
    }
  }
  
  @media (max-width: 1314px) {
    .center {
      width: 95%;
    }
  
    #menu ul {
      width: auto;
    }
  }
  @media (max-width: 881px) {
    #logo {
      width: 265px;
    }
  
    #menu {
      width: auto;
    }
  }
  
  @media (max-width: 813px) {
    #logo {
      float: none;
      /*width: 240px;*/
      margin: 0px auto;
      margin-top: 20px;
    }
  
    #menu,
    #menu ul {
      clear: both;
      float: none;
      width: 100%;
      margin: 0px;
      padding: 0px;
      line-height: 43px;
    }
  }
  </style>
  