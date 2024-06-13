<template>
    <section id="content">
      <router-link to="/home" active-class="active"> <q-btn size="large" flat round icon="home"  style="color:rgba(0, 28, 73, 1);"></q-btn>¿No quieres subir Imagenes?</router-link>
      <q-card class="subir-imagenes-card">     
        <q-card-section>
          <h2>Subir Imágenes para Camiseta</h2>
          <q-form @submit.prevent="subirImagenes">
            <q-file v-model="archivos" label="Seleccionar Imágenes" multiple required />
            <q-btn label="Subir Imágenes" type="submit" text-color="white" class="botonEditar" />
          </q-form>
          <div v-if="mensaje" class="mensaje">{{ mensaje }}</div>
        </q-card-section>
      </q-card>
    </section>
  </template>
  
  <script>
  import { defineComponent, ref } from 'vue';
  import { QCard, QCardSection, QForm, QFile, QBtn } from 'quasar';
  import axios from 'axios';
  
  export default defineComponent({
    name: 'SubirImagenes',
    components: {
      QCard,
      QCardSection,
      QForm,
      QFile,
      QBtn,
    },
    props: {
      idCamiseta: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const archivos = ref(null);
      const mensaje = ref('');
  
      const subirImagenes = () => {
        const formData = new FormData();
        if (archivos.value) {
          for (let i = 0; i < archivos.value.length; i++) {
            formData.append(`imagen${i}`, archivos.value[i]);
          }
        }
  
        axios
          .post(`http://localhost:3900/api/upload-image/${props.idCamiseta}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((response) => {
            mensaje.value = 'Imágenes subidas correctamente.';
          })
          .catch((error) => {
            mensaje.value = 'Error al subir las imágenes.';
            console.error('Error al subir imágenes:', error);
          });
      };
  
      return {
        archivos,
        subirImagenes,
        mensaje,
      };
    },
  });
  </script>
  
  <style scoped>
  #content {
    width: 70%;
    min-height: 67.9vh;
    margin-right: 10px;
  }
  
  .subir-imagenes-card {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .mensaje {
    margin-top: 20px;
    font-weight: bold;
  }
  .botonEditar{
    background-color:rgba(0, 28, 73, 1);
  }
  </style>
  