<template>
    <section id="content">
      <q-card class="crear-camiseta-card">
        <q-card-section>
          <h2>Crear Nueva Camiseta</h2>
          <q-form @submit.prevent="crearCamiseta">
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
  
            <q-btn label="Crear Camiseta" text-color="white" type="submit" class="botonEditar"/>
          </q-form>
        </q-card-section>
      </q-card>
    </section>
  </template>
  
  <script>
  import { defineComponent, ref } from 'vue';
  import { QCard, QCardSection, QForm, QInput, QSelect, QBtn } from 'quasar';
  import axios from 'axios';
  import { useRouter } from "vue-router";
  export default defineComponent({
    name: 'CrearCamiseta',
    components: {
      QCard,
      QCardSection,
      QForm,
      QInput,
      QSelect,
      QBtn,
    },
    setup() {
      const router = useRouter();
      const equipo = ref('');
      const equipacion = ref(null);
      const año = ref('');
      const jugadores = ref([{ nombre: '', numero: null }]);
      const descripcion = ref('');
      const precio = ref(null);
      const liga = ref('');
      const tallasSeleccionadas = ref([]);
      const tallasDisponibles = ref(['S', 'M', 'L', 'XL', 'XXL']);
  
      const agregarJugador = () => {
        jugadores.value.push({ nombre: '', numero: null });
      };
  
      const eliminarJugador = (index) => {
        jugadores.value.splice(index, 1);
      };
  
      const crearCamiseta = () => {
        const nuevaCamiseta = {
          equipo: equipo.value,
          equipacion: equipacion.value,
          año: año.value,
          jugadores: jugadores.value,
          descripcion: descripcion.value,
          precio: precio.value,
          liga: liga.value,
          talla: tallasSeleccionadas.value,
        };
  
        axios.post('http://localhost:3900/api/save', nuevaCamiseta)
          .then(response => {
            const idCamiseta = response.data.camiseta._id;
            router.push(`/subir-imagenes/${idCamiseta}`);
          })
          .catch(error => {
            console.error('Error al crear la camiseta:', error);
          });
      };
  
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
        crearCamiseta,
      };
    },
  });
  </script>
  
  <style scoped >
  #content {
    width: 70%;
    min-height: 67.9vh;
    margin-right: 10px;
  }
  
  .crear-camiseta-card {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .jugador-fields {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .jugador-fields > * {
    margin-right: 10px;
  }
  .botonEditar{
    background-color:rgba(0, 28, 73, 1);
  }
  </style>
  