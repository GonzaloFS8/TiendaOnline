<template>
    <div>
      <h2 class="q-mb-md">Listado de Reseñas</h2>
  
      <div v-if="reseñas.length === 0" class="q-mb-md">
        <q-card>
          <q-card-section>
            <q-item main-label="No hay reseñas disponibles"></q-item>
          </q-card-section>
        </q-card>
      </div>
  
      <q-card v-else class="q-mb-md">
        <q-card-section>
          <q-list v-for="(resena, index) in reseñas" :key="index">
            <q-item>
              <q-item-section>
                <q-item-label header>
                  <p><strong>Usuario:</strong> {{ resena.usuario.nombre }}</p>
                  <p><strong>Valoración:</strong> {{ resena.valoracion }}</p>
                  <p><strong>Comentario:</strong> {{ resena.comentario }}</p>
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator />
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, onMounted } from 'vue';
  import axios from 'axios';
  // Importar componentes específicos de Quasar
  import {
    QCard,
    QCardSection,
    QItem,
    QItemSection,
    QItemLabel,
    QSeparator,
    QList
  } from 'quasar';
  
  export default defineComponent({
    name: 'MostrarReseñas',
    components: {
      QCard,
      QCardSection,
      QItem,
      QItemSection,
      QItemLabel,
      QSeparator,
      QList
    },
    setup() {
      const reseñas = ref([]);
  
      const obtenerTodasReseñas = async () => {
        try {
          const response = await axios.get('http://localhost:3900/api/resenas');
          reseñas.value = response.data.reseñas;
        } catch (error) {
          console.error('Error al obtener las reseñas:', error);
        }
      };
  
      onMounted(() => {
        obtenerTodasReseñas();
      });
  
      return {
        reseñas
      };
    }
  });
  </script>
  
  <style scoped>
  .q-mb-md {
    margin-bottom: 20px;
  }
  </style>
  