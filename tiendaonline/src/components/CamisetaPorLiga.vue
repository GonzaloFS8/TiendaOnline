<template>
    <section id="content">
      <h2 class="subheader">{{ liga }}</h2>
      <!-- Listado de Camisetas Filtradas por Liga -->
      <div id="articles" v-if="camisetasFiltradas.length">
        <div class="article-div">
          <article
            class="article-item"
            v-for="(camiseta, index) in camisetasFiltradas"
            :key="camiseta._id"
          >
            <div class="article-content">
              <q-carousel
                v-model="ImageIndices[index]"
                swipeable
                animated
                control-indicators
                navigation
                style="width: 100%; height: 200px;"
              >
                <q-carousel-slide
                  v-for="(imagen, idx) in camiseta.imagenes"
                  :key="idx"
                  :name="idx"
                >
                  <q-img
                    :src="'http://localhost:3900/api/get-images/' + camiseta._id + '/' + imagen"
                    alt="Imagen Camiseta"
                    max-width="100%"
                    height="100%"
                  />
                </q-carousel-slide>
              </q-carousel>
              <h2>{{ camiseta.equipo }}</h2>
              <p>{{ camiseta.precio }}.00€</p>
              <p>{{ camiseta.año }}</p>
              <router-link :to="'/camiseta/' + camiseta._id" class="btn">Ver Camiseta</router-link>
            </div>
          </article>
        </div>
      </div>
    </section>
  </template>
  
  <script>
import axios from "axios";
import { ref, defineComponent, onMounted, watch } from "vue";
import { QCarousel, QCarouselSlide, QImg } from 'quasar';

export default defineComponent({
    name: "CamisetasPorLiga",
    components: {
        QCarousel,
        QCarouselSlide,
        QImg
    },
    props: {
        liga: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const camisetas = ref([]);
        const camisetasFiltradas = ref([]);
        const ImageIndices = ref([]);

        const getCamisetas = () => {
            axios
            .get("http://localhost:3900/api/camisetas")
            .then((res) => {
                camisetas.value = res.data.camisetas;
                camisetasFiltradas.value = camisetas.value.filter(camiseta => camiseta.liga === props.liga);
                ImageIndices.value = new Array(camisetasFiltradas.value.length).fill(0);
             })
            .catch((error) => {
                console.error("Error", error);
             });
        };

        onMounted(getCamisetas);

        // Watcher para detectar cambios en la prop liga y que actualice el resultado de la Pagina automaticamente.
        watch(() => props.liga, (newValue, oldValue) => {
            if (newValue!== oldValue) {
                getCamisetas();
            }
        });

        return {
            camisetasFiltradas,
            ImageIndices
        };
    }
});
</script>
  
<style>
#content {
  width: 60%;
  min-height: 650px;
  margin-right: 10px;
  padding-left: 3%;
}

.subheader {
  font-size: 38px;
  width: 100%;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  padding-left: 3%;
}

.article-div {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding-left: 3%;
}

.article-item {
  width: calc(16.66% - 20px);
  border: 1px solid #eee;
  margin-bottom: 20px;
}

.article-content {
  padding: 20px;
}

.image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-content h2 {
  margin: 0;
  font-size: 20px;
  margin-bottom: 7px;
}

.article-content a.btn {
  display: block;
  margin-top: 10px;
  color: #fff;
  background-color: rgba(0, 28, 73, 1);
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.article-content a.btn:hover {
  background-color: rgb(218, 38, 38);
}
</style>
