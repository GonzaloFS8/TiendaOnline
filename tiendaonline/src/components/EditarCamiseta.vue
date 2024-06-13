<template>
    <section id="content">
      <q-card class="editar-camiseta-card">
        <q-card-section>
          <h2>Editar Camiseta</h2>
          <q-form @submit.prevent="editarCamiseta">
            <q-input v-model="equipo" label="Equipo" required/>
            <q-input v-model="equipacion" label="Equipación" type="number" required/>
            <q-input v-model="año" label="Año" required/>
            
            <div v-for="(jugador, index) in jugadores" :key="index" class="jugador-fields">
              <q-input v-model="jugador.nombre" label="Nombre del Jugador" required/>
              <q-input v-model="jugador.numero" label="Número del Jugador" type="number" required/>
              <q-btn icon="delete" @click="eliminarJugador(index)" color="negative"/>
            </div>
            <q-btn icon="add" @click="agregarJugador" text-color="white" class="botonEditar">Agregar Jugador</q-btn>
  
            <q-input v-model="descripcion" label="Descripción" type="textarea" required/>
            <q-input v-model="precio" label="Precio" type="number" required/>
            <q-input v-model="liga" label="Liga" required/>
  
            <q-select v-model="tallasSeleccionadas" :options="tallasDisponibles" label="Seleccionar Tallas" multiple required/>
            
            <div v-if="camiseta.imagenes.length">
              <q-carousel
                v-model="currentImage"
                swipeable
                animated
                arrows
                control-indicators
                navigation
                class="camiseta-carousel"
              >
                <q-carousel-slide
                  v-for="(imagen, idx) in camiseta.imagenes"
                  :key="idx"
                  :name="idx"
                >
                  <div class="image-container">
                    <q-img
                      :src="'http://localhost:3900/api/get-images/' + camiseta._id + '/' + imagen"
                      alt="Imagen Camiseta"
                      class="camiseta-img"
                    />
                    <q-btn icon="delete" color="negative" @click="eliminarImagen(camiseta._id, imagen)" class="delete-image-btn"/>
                  </div>
                </q-carousel-slide>
              </q-carousel>
            </div>
            
            <q-btn label="Editar Camiseta" text-color="white" type="submit" class="botonEditar"/>
          </q-form>
        </q-card-section>
      </q-card>
    </section>
  </template>
  
  <script>
  import { defineComponent, ref, onMounted } from 'vue';
  import { QCard, QCardSection, QForm, QInput, QSelect, QCarousel, QCarouselSlide, QImg, QBtn } from 'quasar';
  import axios from 'axios';
  import { useRouter, useRoute } from "vue-router";
  
  export default defineComponent({
    name: 'EditarCamiseta',
    components: {
      QCard,
      QCardSection,
      QForm,
      QInput,
      QSelect,
      QCarousel,
      QCarouselSlide,
      QImg,
      QBtn,
    },
    setup() {
      const router = useRouter();
      const route = useRoute();
      const camisetaId = ref('');
      const equipo = ref('');
      const equipacion = ref(null);
      const año = ref('');
      const jugadores = ref([{ nombre: '', numero: null }]);
      const descripcion = ref('');
      const precio = ref(null);
      const liga = ref('');
      const tallasSeleccionadas = ref([]);
      const tallasDisponibles = ref(['S', 'M', 'L', 'XL', 'XXL']);
      const camiseta = ref({ imagenes: [] });
      const currentImage = ref(0);
  
      const agregarJugador = () => {
        jugadores.value.push({ nombre: '', numero: null });
      };
  
      const eliminarJugador = (index) => {
        jugadores.value.splice(index, 1);
      };
  
      const cargarCamiseta = () => {
        axios.get(`http://localhost:3900/api/camiseta/${camisetaId.value}`)
          .then(response => {
            const data = response.data.camiseta;
            equipo.value = data.equipo;
            equipacion.value = data.equipacion;
            año.value = data.año;
            jugadores.value = data.jugadores;
            descripcion.value = data.descripcion;
            precio.value = data.precio;
            liga.value = data.liga;
            tallasSeleccionadas.value = data.talla;
            camiseta.value = data;
          })
          .catch(error => {
            console.error('Error al cargar la camiseta:', error);
          });
      };
  
      const eliminarImagen = (id, imageName) => {
        axios.delete(`http://localhost:3900/api/delete-image/${id}/${imageName}`)
          .then(response => {
            if (response.data.status === 'success') {
              camiseta.value.imagenes = camiseta.value.imagenes.filter(img => img !== imageName); //Crea un nuevo array de imagenes excluyendo la que coincida con imageName.
            }
          })
          .catch(error => {
            console.error('Error al eliminar la imagen:', error);
          });
      };
  
      const editarCamiseta = () => {
        const camisetaActualizada = {
          equipo: equipo.value,
          equipacion: equipacion.value,
          año: año.value,
          jugadores: jugadores.value,
          descripcion: descripcion.value,
          precio: precio.value,
          liga: liga.value,
          talla: tallasSeleccionadas.value,
        };
  
        axios.put(`http://localhost:3900/api/camiseta/${camisetaId.value}`, camisetaActualizada)
          .then(response => {
            router.push(`/subir-imagenes/${camisetaId.value}`);
          })
          .catch(error => {
            console.error('Error al editar la camiseta:', error);
          });
      };
  
      onMounted(() => {
        camisetaId.value = route.params.id;
        cargarCamiseta();
      });
  
      return {
        equipo,
        equipacion,
        año,
        jugadores,
        descripcion,
        precio,
        liga,
        tallasSeleccionadas,
        tallasDisponibles,
        agregarJugador,
        eliminarJugador,
        editarCamiseta,
        camiseta,
        currentImage,
        eliminarImagen,
      };
    },
  });
  </script>
  
  <style scoped>
  #content {
    position: relative;
    width: 60%;
    min-height: 67.9vh;
    margin-right: 10px;
  }
  
  .editar-camiseta-card {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .jugador-fields {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .camiseta-carousel {
    width: 100%;
    height: 300px;
  }
  
  .camiseta-img {
    width: 100%;
    height: 100%;
  }
  .jugador-fields > * {
    margin-right: 10px;
  }
  .image-container {
    position: relative;
  }
  
  .delete-image-btn {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .botonEditar{
    background-color:rgba(0, 28, 73, 1);
  }
  </style>
  