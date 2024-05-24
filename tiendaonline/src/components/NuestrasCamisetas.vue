<template>
  <section id="content">
    <h2 class="subheader">Nuestros Productos</h2>
    <!-- Listado Camisetas -->
    <div id="articles" v-if="camisetas.length">
      <div class="article-div">
        <article
          class="article-item"
          v-for="(camiseta, camisetaIndex) in camisetas"
          :key="camiseta._id"
        >
          <div class="article-content">
            <q-carousel
              v-model="currentImageIndices[camisetaIndex]"
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
                style="padding: 0%;"
              >
                <q-img :src="'http://localhost:3900/api/get-images/' + camiseta._id + '/' + imagen" alt="Imagen Camiseta" max-width="100%" height="100%" />
              </q-carousel-slide>
            </q-carousel>
            <h2>{{ camiseta.equipo }}</h2>
            <p>{{ camiseta.año }}</p>
            <a :href="'/camiseta/' + camiseta._id" class="btn">Ver Camiseta</a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import { ref, defineComponent, onMounted } from "vue";
import { QCarousel, QCarouselSlide, QBtn, QCard, QImg } from 'quasar';

export default defineComponent({
  name: "NuestrasCamisetas",
  components: {
    QCarousel,
    QCarouselSlide,
    QBtn,
    QCard,
    QImg
  },
  setup() {
    const camisetas = ref([]);
    const currentImageIndices = ref([]);

    const getCamisetas = () => {
      axios
       .get("http://localhost:3900/api/camisetas")
       .then((res) => {
          camisetas.value = res.data.camisetas;
          currentImageIndices.value = new Array(res.data.camisetas.length).fill(0);
        })
       .catch((error) => {
          console.error("Error fetching camisetas:", error);
        });
    };

    onMounted(() => {
      getCamisetas();
    });

    return {
      camisetas,
      currentImageIndices,
    };
  },
});
</script>
<style>
#content {
  width: 60%;
  min-height: 650px;
  margin-right: 10px;
}

.subheader {
  font-size: 38px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.article-div {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
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
  background-color: #007bff;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.article-content a.btn:hover {
  background-color: #0056b3;
}
</style>