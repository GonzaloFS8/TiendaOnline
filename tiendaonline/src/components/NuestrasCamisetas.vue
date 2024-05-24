<template>
  <section id="content">
    <h2 class="subheader">Nuestros Productos</h2>
    <!-- Listado Camisetas -->
    <div id="articles" v-if="camisetas.length">
      <div class="article-div">
        <article
          class="article-item"
          v-for="(camiseta, index) in camisetas"
          :key="camiseta._id"
        >
          <div class="article-content">
            
            <div class="image">
              
              <img
                :src="camiseta.imagenes.length > 0 ? camiseta.imagenes[0] : ''"
                alt="Imagen Camiseta"
              />
            </div>
            
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

export default defineComponent({
  name: "NuestrasCamisetas",
  setup() {
    const camisetas = ref([]);

    const getCamisetas = () => {
      axios
        .get("http://localhost:3900/api/camisetas")
        .then((res) => {
          camisetas.value = res.data.camisetas;
          console.log("Camisetas", camisetas);
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
