<template>
  <section id="content">
    <h2 class="subheader">Nuestros Productos <img src="../assets/imagenes/logoTienda.png" class="app-logo" alt="Logotipo" /> 
      <router-link :to="'/crear-camiseta'" >
      <q-btn v-if="userRole=='admin'" class="crear" size='large' round icon="add_circle" color="red" style="margin: 5px;  "></q-btn>
      </router-link> 
    </h2>
    <!-- Listado Camisetas -->
    <div id="articles" v-if="camisetas.length">
      <div class="article-div">
        <article
          class="article-item"
          v-for="(camiseta, index) in camisetas"
          :key="camiseta._id"
        >
          <div class="article-content">
            <q-carousel
              v-model="ImageIndices[index]" 
              swipeable
              animated
              arrows
            control-type="regular"
            control-text-color="red" 
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
            <p>Equipacion:{{ camiseta.equipacion }}</p>
            <router-link :to="'/camiseta/' + camiseta._id" class="btn" >Ver Camiseta </router-link>
            <router-link :to="'/editar-camiseta/' + camiseta._id" style="text-decoration:none;">
             <q-btn v-if="userRole=='admin'" round icon="edit" style="margin: 5px; color:rgba(0, 28, 73, 1);"></q-btn>
            </router-link>
            <q-btn v-if="userRole=='admin'" round icon="delete" color="red" style="margin: 5px;" @click="eliminarCamiseta(camiseta._id)" />
          </div>
        </article>
      </div>
     
    </div>
  </section>
</template>

<script>
import axios from "axios";
import { ref, defineComponent, onMounted } from "vue";
import { QBtn, QCarousel, QCarouselSlide, QImg } from 'quasar';
import { jwtDecode } from 'jwt-decode'; 
export default defineComponent({
  name: "NuestrasCamisetas",
  components: {
    QCarousel,
    QCarouselSlide,
    QImg,
    QBtn
  },
  setup() {
    const camisetas = ref([]);
    const ImageIndices = ref([]);

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
    const getCamisetas = () => {
      axios
       .get("http://localhost:3900/api/camisetas")
       .then((res) => {
          camisetas.value = res.data.camisetas;
          ImageIndices.value = new Array(res.data.camisetas.length).fill(0); //  para manejar varias imágenes por camiseta
        })
       .catch((error) => {
          console.error("Error", error);
        });
    };

    const eliminarCamiseta = (idCamiseta) => {
      axios
        .delete(`http://localhost:3900/api/camiseta/${idCamiseta}`)
        .then((res) => {
          if (res.data.status === 'success') {
            camisetas.value = camisetas.value.filter(camiseta => camiseta._id !== idCamiseta);
          }
        })
        .catch((error) => {
          console.error("Error al eliminar la camiseta", error);
        });
    };


    onMounted(() => {
      getCamisetas();
      decodificarToken();
    });

    return {
      camisetas,
      ImageIndices,
      eliminarCamiseta,
      userId,
      userRole
    };
  },
});
</script>

<style scoped>
#content {
  width: 70%;
  min-height: 67.9vh;
  margin-right: 10px;
  padding-left: 3%;
}

.subheader {
  font-size: 38px;
  width: 100%;
  border-bottom: 1px solid rgb(218, 38, 38);
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

.app-logo {
    display: block;
    float: right;
    height: 75px;
    margin-top: -9px;
    margin-right: 10px;
    animation: latir infinite 5s linear;
}

.crear{
  float:left
}
</style>
