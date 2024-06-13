<template>
    <div id="slider">
      <div class="search">
        <q-select
          filled
          dense
          outlined
          v-model="selectedFiltro"
          :options="filtros"
          label="¿QUE QUIERES BUSCAR?"
          label-color="white"
          bg-color="red-7"
          style="width: 30%;"
        ></q-select>
        <q-select
          v-if="selectedFiltro === 'Liga'"
          filled
          dense
          outlined
          v-model="selectedLiga"
          :options="ligas"
          label="Seleccionar liga"
          label-color="white"
          bg-color="red-7"
          style="width: 30%; "
          @update:model-value="getEquiposPorLiga"
          
        ></q-select>
        <q-select
          v-if="selectedFiltro === 'Equipo'"
          filled
          dense
          outlined
          v-model="selectedEquipo"
          :options="equipos"
          label-color="white"
          bg-color="red-7"
          style="width: 30%; "
          label="Seleccionar equipo"
        ></q-select>
        <q-select
          v-if="selectedFiltro === 'Liga' && selectedLiga"
          filled
          dense
          outlined
          v-model="selectedEquipo"
          :options="equiposFiltradosPorLiga"
          label-color="white"
          bg-color="red-7"
          style="width: 30%; "
          label="Seleccionar equipo (opcional)"
        ></q-select>
        <q-btn class="claseBoton" round icon="search" @click="Buscar" />
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, onMounted, watch } from "vue";
  import { QSelect, QBtn } from 'quasar';
  import axios from 'axios';
  import { useRouter } from 'vue-router'; 
  
  export default defineComponent({
    name: 'SliderComponent',
    components: {
      QSelect,
      QBtn
    },
    setup() {
      const selectedFiltro = ref('');
      const selectedLiga = ref('');
      const selectedEquipo = ref('');
      const ligas = ref([]);
      const equipos = ref([]);
      const equiposFiltradosPorLiga = ref([]);
      const filtros = ref(['Liga', 'Equipo']);
      const router = useRouter();
  
      const getLigas = () => {
        axios
          .get('http://localhost:3900/api/ligas')
          .then((res) => {
            ligas.value = res.data.ligas;
            // Obtener todos los equipos disponibles inicialmente
            axios
              .get('http://localhost:3900/api/equipos')
              .then((res) => {
                equipos.value = res.data.equipos;
              })
              .catch((error) => {
                console.error("Error equipos:", error);
              });
          })
          .catch((error) => {
            console.error("Error ligas:", error);
          });
      };
  
      const getEquiposPorLiga = async () => {
        try {
          if (selectedLiga.value) {
            const response = await axios.get(`http://localhost:3900/api/equipos/${selectedLiga.value}`);
            equiposFiltradosPorLiga.value = response.data.equipos;
          } else {
            equiposFiltradosPorLiga.value = [];
          }
        } catch (error) {
          console.error("Error al obtener equipos por liga:", error);
        }
      };
  
      const Buscar = () => {
        if (selectedFiltro.value === 'Liga') {
          if (selectedEquipo.value) {
            // página de camisetas por equipo 
            router.push(`/camisetas/equipo/${selectedEquipo.value}`);
          } else {
            // página de camisetas por liga
            router.push(`/camisetas/${selectedLiga.value}`);
          }
        } else if (selectedFiltro.value === 'Equipo') {
          // página de camisetas por equipo
          router.push(`/camisetas/equipo/${selectedEquipo.value}`);
        }
        selectedEquipo.value=''
        selectedLiga.value=''
      };
  
      onMounted(getLigas);
  
      watch(selectedLiga, () => {
        getEquiposPorLiga();
        selectedEquipo.value=''
      });
  
      return {
        selectedFiltro,
        selectedLiga,
        selectedEquipo,
        ligas,
        equipos,
        equiposFiltradosPorLiga,
        filtros,
        Buscar
      };
    }
  });
  </script>

<style>

#slider {
    width: 100%;
    height: 100%;
    color: white;
    text-shadow: 0px 0px 5px #444;

    /* DEGRADADO*/
    background: rgba(243, 48, 48, 1);
    background: -moz-radial-gradient(center, ellipse cover, rgba(243, 48, 48, 1) 0%, rgba(243, 48, 48, 1) 30%, rgba(0, 28, 73, 1) 100%);
    background: -webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%, rgba(243, 48, 48, 1)), color-stop(30%, rgba(243, 48, 48, 1)), color-stop(100%, rgba(0, 28, 73, 1)));
    background: -webkit-radial-gradient(center, ellipse cover, rgba(243, 48, 48, 1) 0%, rgba(243, 48, 48, 1) 30%, rgba(0, 28, 73, 1) 100%);
    background: -o-radial-gradient(center, ellipse cover, rgba(243, 48, 48, 1) 0%, rgba(243, 48, 48, 1) 30%, rgba(0, 28, 73, 1) 100%);
    background: -ms-radial-gradient(center, ellipse cover, rgba(243, 48, 48, 1) 0%, rgba(243, 48, 48, 1) 30%, rgba(0, 28, 73, 1) 100%);
    background: radial-gradient(ellipse at center, rgba(243, 48, 48, 1) 0%, rgba(243, 48, 48, 1) 30%, rgba(0, 28, 73, 1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#f33030', endColorstr='#001c49', GradientType=1);
}


.search {
    display: flex;
    justify-content: center;
    padding: 20px;
    width: 80%;
}

.claseBoton {
    color: rgba(0, 28, 73, 1);
    background-color: rgba(243, 48, 48);
    border-radius: 60%;
    border: none;
    margin-left: 5%;
    margin-top: 0.5%;
    
}
.claseBoton:hover {
    color: white;
    background-color: rgba(243, 48, 48);
    height: 30%;
    border-radius: 60%;
    border: none;
    margin-left: 5%;
    margin-top: 0.5%;
}

.q-select{
  margin-top: 0.5%;
}

</style>
