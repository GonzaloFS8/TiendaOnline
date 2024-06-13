<template>
  <section id="content">
    <div class="camiseta-detalle" v-if="camiseta">
      <q-card class="camiseta-card">
        <div class="camiseta-content">
          <div class="carousel-container">
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
                <q-img
                  :src="'http://localhost:3900/api/get-images/' + camiseta._id + '/' + imagen"
                  alt="Imagen Camiseta"
                  class="camiseta-img"
                />
              </q-carousel-slide>
            </q-carousel>
          </div>
          <div class="camiseta-info">
            <q-card-section>
              <h4>{{ camiseta.equipo }}</h4>
              <h6>{{ camiseta.año }}</h6>
              <p>Equipacion: {{ camiseta.equipacion }}</p>
              <p>{{ camiseta.descripcion }}</p>
              <strong style="font-size: medium">{{ camiseta.precio }}.00€</strong>
              <q-select
                v-model="selectedJugador"
                :options="JugadoresNumYNombre"
                label="Seleccionar Jugador"
              />
              <q-select
                v-model="selectedTalla"
                :options="camiseta.talla"
                label="Seleccionar Talla"
              />
              <q-select
                v-model="selectedCantidad"
                :options="[1, 2, 3, 4, 5]"
                label="Seleccionar Cantidad"
              />
              <q-btn
               text-color="white"
                label="Agregar al Carrito"
                @click="agregarAlCarrito"
                class="agregar-carrito-btn"
              />
              <q-btn
               text-color="white"
                label="Limpiar Selección"
                @click="limpiarSeleccion"
                class="agregar-carrito-btn"
              />
            </q-card-section>
          </div>
        </div>
      </q-card>
    </div>
    <div v-else>
      <p>Cargando...</p>
    </div>
  </section>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { QCard, QCarousel, QCarouselSlide, QImg, QCardSection, QSelect, QBtn } from 'quasar';
import { jwtDecode } from 'jwt-decode'; 

export default defineComponent({
  name: 'CamisetaDetalle',
  components: {
    QCard,
    QCarousel,
    QCarouselSlide,
    QImg,
    QCardSection,
    QSelect,
    QBtn,
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const camiseta = ref(null);
    const currentImage = ref(0);
    const selectedJugador = ref(null);
    const selectedTalla = ref(null);
    const selectedCantidad = ref(1); // Valor inicial para la cantidad

    const getCamiseta = () => {
      axios
        .get(`http://localhost:3900/api/camiseta/${props.id}`)
        .then((res) => {
          camiseta.value = res.data.camiseta;
        })
        .catch((error) => {
          console.error('Error camiseta:', error);
        });
    };

    const userRole = ref(null);
    const userId=ref(null);
  const DecodificarToken =() =>{
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token); 
        userId.value = decodedToken.userId;
        userRole.value = decodedToken.role;
      }
    }


    const agregarAlCarrito = () => {
      const imagenesCamiseta = camiseta.value.imagenes;
      axios.post('http://localhost:3900/api/agregar-al-carrito', {
        idUsuario: userId.value,
        idCamiseta: camiseta.value._id,
        talla: selectedTalla.value,
        jugador: selectedJugador.value ? selectedJugador.value.label : '',
        cantidad: selectedCantidad.value.toString(),
        imagenes: imagenesCamiseta
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
    
    }

    const limpiarSeleccion = () => {
      selectedJugador.value = null;
      selectedTalla.value = null;
      selectedCantidad.value = 1;
    };

    onMounted(() => {
      getCamiseta();
      DecodificarToken();
    });

    const JugadoresNumYNombre = computed(() => {
      if (camiseta.value && camiseta.value.jugadores) {
        return camiseta.value.jugadores.map(jugador => ({
          label: `${jugador.numero} - ${jugador.nombre}`,
          value: jugador
        }));
      }
      return [];
    });

    return {
      camiseta,
      currentImage,
      selectedJugador,
      selectedTalla,
      selectedCantidad,
      JugadoresNumYNombre,
      agregarAlCarrito,
      limpiarSeleccion,
      userId
    };
  },
});
</script>

<style scoped>
#content {
  width: 60%;
  min-height: 67.9vh;
  margin-right: 10px;
}

.camiseta-detalle {
  display: flex;
  justify-content: center;
  width: 100%;
}

.camiseta-card {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  align-items: center;
}

.camiseta-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}

.carousel-container {
  flex: 1;
  max-width: 400px;
}

.camiseta-info {
  flex: 1;
  padding: 20px;
}

.camiseta-carousel {
  width: 100%;
  height: 100%;
}

.camiseta-img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.agregar-carrito-btn {
  background-color:rgba(0, 28, 73, 1);;
  margin-top: 20px;
  margin-right: 10px;
}


</style>
