<template>
    <section id="content">
    <div class="camiseta-detalle" v-if="camiseta">
      <q-card class="camiseta-card">
        <q-carousel
          v-model="currentImage"
          swipeable
          animated
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
        <q-card-section>
          <h2>{{ camiseta.equipo }}</h2>
          <p>{{ camiseta.precio }}.00€</p>
          <p>{{ camiseta.año }}</p>
        </q-card-section>
      </q-card>
    </div>
    <div v-else>
      <p>Cargando...</p>
    </div>
</section>
  </template>
  
  <script>
  import { defineComponent, ref, onMounted } from 'vue';
  import axios from 'axios';
  import { QCard, QCarousel, QCarouselSlide, QImg, QCardSection } from 'quasar';
  
  export default defineComponent({
    name: 'CamisetaDetalle',
    components: {
      QCard,
      QCarousel,
      QCarouselSlide,
      QImg,
      QCardSection,
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
  
      onMounted(() => {
        getCamiseta();
      });
  
      return {
        camiseta,
        currentImage,
      };
    },
  });
  </script>
  
  <style scoped>
  #content {
  width: 60%;
  min-height: 650px;
  margin-right: 10px;
}

  .camiseta-detalle {
    display: flex;
    justify-content: center;
    width: 50%;
    height: 20%;
  }
  
  .camiseta-card {
    width: 40%;
    max-width: 80%;
    height: 50%;
    margin: 0 auto;
  }
  
  .camiseta-carousel {
    width: 100%;
    height: 50%; 
  }
  
  .camiseta-img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
  </style>
  