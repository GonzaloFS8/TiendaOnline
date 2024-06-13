<template>
    <aside id="sidebar">
      <div class="sidebar-item">
        <h3>TU OPINIÓN ES IMPORTANTE</h3>
        <q-btn @click="mostrarDialogo" href="#" class="btn btn-success q-ma-md" style="background-color: rgba(0, 28, 73, 1)">
          <strong style="color: white;" >CREAR RESEÑA</strong>
        </q-btn>
        <q-dialog v-model="dialogoVisible">
          <div class="q-dialog-plugin">
            <q-card>
              <q-card-section>
                <q-rating
                  v-model="valoracion"
                  max="5"
                  size="3.5em"
                  color="yellow"
                  icon="star_border"
                  icon-selected="star"
                  icon-half="star_half"
                  no-dimming
                ></q-rating>
                <q-input
                  v-model="comentario"
                  auto-grow
                  placeholder="Escribe tu reseña..."
                  type="textarea"
                ></q-input>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn @click="crearReseña" text-color="white" style="background-color: rgba(0, 28, 73, 1)" label="Enviar Reseña"></q-btn>
                <q-btn @click="cerrarDialogo" icon="close"></q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </q-dialog>
      </div>
      <div v-if="reseñas.length === 0">
      <p>No hay reseñas aún.</p>
    </div>
    <ul v-else  >
      <li v-for="(resena, index) in reseñas" :key="index" class="lista" >
        <p><strong>Usuario:</strong>{{ resena.usuario.nombreUsuario }}</p>
        <p><strong>Valoración:</strong> {{ resena.valoracion }}<q-icon name="star" class="text-red" size="md"></q-icon></p>
        <p><strong>Comentario:</strong> {{ resena.comentario }}</p>
        <hr>
      </li>
    </ul>
  </aside>
  </template>
  <script>
  import { defineComponent, ref, onMounted } from 'vue';
  import axios from 'axios';
  import { QBtn, QDialog, QCard, QCardSection, QCardActions, QInput, QRating, QIcon } from 'quasar';
  import { jwtDecode } from 'jwt-decode';
  
  export default defineComponent({
    name: 'CrearReseña',
    components: {
      QBtn,
      QDialog,
      QCard,
      QCardSection,
      QCardActions,
      QInput,
      QRating,
      QIcon
    },
    setup() {
      const valoracion = ref(0);
      const comentario = ref('');
      const dialogoVisible = ref(false);
      const userId = ref(null);
      const reseñas = ref([]);
  
      const DecodificarToken = () => {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          userId.value = decodedToken.userId;
        }
      };
  
      const mostrarDialogo = () => {
        dialogoVisible.value = true;
      };
  
      const cerrarDialogo = () => {
        dialogoVisible.value = false;
      };
  
      const obtenerTodasReseñas = async () => {
        try {
          const response = await axios.get('http://localhost:3900/api/resenas');
          reseñas.value = response.data.reseñas;
        } catch (error) {
          console.error('Error al obtener las reseñas:', error);
        }
      };
  
      const crearReseña = () => {
        const nuevaReseña = {
          usuarioId: userId.value,
          valoracion: valoracion.value,
          comentario: comentario.value
        };
  
        axios.post('http://localhost:3900/api/resenas', nuevaReseña)
          .then(response => {
            console.log('Reseña creada correctamente:', response.data);
            cerrarDialogo();
            cargarReseñas();
          })
          .catch(error => {
            console.error('Error al crear la reseña:', error);
          });
      };
  
      onMounted(() => {
        DecodificarToken();
        obtenerTodasReseñas();
      });
  
      return {
        valoracion,
        comentario,
        dialogoVisible,
        mostrarDialogo,
        cerrarDialogo,
        reseñas,
        crearReseña
      };
    }
  });
  </script>
  
  <style>
  #sidebar {
    width: 15%;
    float: right;
    padding: 2%;
    padding-top: 0%;
    margin: 0%;
  }
  
  .sidebar-item {
    background: #f7f7f7;
  }
  
  .sidebar-item h3 {
    text-transform: uppercase;
    font-size: 18px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 3px solid rgba(0, 28, 73, 1);
  }
  
  .btn-success {
    background: rgba(0, 28, 73, 1);
  }
  
  .btn-success:hover {
    background: rgb(218, 38, 38);
  }
  .lista{
    margin-right: 20%;margin-top:10%;background-color: #f7f7f7;
  }
  </style>
  