<template>
  <section id="content">
    <h2>Mi Cuenta</h2>
    <div v-if="usuario">
      <img src="../assets/imagenes/messi.png" class="app-logo" alt="Logotipo" >
      <p><strong>Nombre de Usuario:</strong> {{ usuario.nombreUsuario }}</p>
      <p><strong>Correo Electrónico:</strong> {{ usuario.correo }}</p>
      <p><strong>ROL:</strong> {{ userRole }}</p>
    </div>
    <div v-else>
      <p>No se ha cargado la información del usuario.</p>
    </div>
  </section>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 

export default defineComponent({
  name: 'MiCuenta',
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

      const usuario = ref(null);
    const obtenerInformacionUsuario = () => {
      axios.get(`http://localhost:3900/api/obtener-usuario/${userId.value}`) 
        .then(response => {
          usuario.value = response.data.usuario;
        })
        .catch(error => {
          console.error('Error al obtener la información del usuario:', error);
        });
    };

    onMounted(() => {

      decodificarToken();
      obtenerInformacionUsuario();
      
    });

    return {
      usuario,
      userRole
    };
  }
});
</script>

<style scoped >
.mi-cuenta {
  width: 50%;
  height: 100%;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.app-logo{
  max-width: 400px; max-height: 400px;
}
</style>
