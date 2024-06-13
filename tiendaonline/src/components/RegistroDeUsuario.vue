<template>
  <section id="content">
    <h2 class="subheader">
      Registro de Cuenta
      <img src="../assets/imagenes/logoTienda.png" class="app-logo" alt="Logotipo" />
    </h2>
    <q-card class="q-pa-md" style="width: 60%; left: 18%">
      <q-card-section>
        <q-form @submit.prevent="registrarUsuario" @reset="resetFormulario">
          <q-input
            filled
            v-model="nombreUsuario"
            label="Nombre de Usuario"
            required
            :rules="[
              (val) => (val && val.length > 0) || 'Nombre de Usuario es requerido',
            ]"
          />

          <q-input
            filled
            v-model="correo"
            label="Correo Electrónico"
            type="email"
            required
            :rules="[
              (val) => (val && val.length > 0) || 'Correo es requerido',
              (val) => esCorreoValido(val) || 'Ingrese un correo válido',
            ]"
            :error="errorCorreo"
          />

          <q-input
            filled
            v-model="contrasena"
            label="Contraseña"
            type="password"
            required
            :rules="[
              (val) => (val && val.length > 0) || 'Contraseña es requerida',
              (val) =>
                (val && val.length >= 8) ||
                'Contraseña debe tener al menos 8 caracteres',
              (val) =>
                /\d/.test(val) || 'Contraseña debe contener al menos un número',
            ]"
            class="q-mt-md"
          />

          <div class="q-mt-md">
            <q-btn label="Registrar Cuenta" type="submit" class="botones" :loading="cargando" />
            <q-btn label="Resetear" type="reset" flat class="q-ml-sm botones" />
          </div>

          <q-dialog v-model="mostrarError">
            <q-card>
              <q-card-section class="row items-center">
                <q-icon name="warning" color="negative" size="40px" class="q-mr-sm" />
                <span class="text-h6">{{ mensajeError }}</span>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn flat label="Cerrar" color="primary"  @click="resetFormulario"/>
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-form>
      </q-card-section>
    </q-card>
  </section>
</template>

<script>
import { defineComponent, ref } from "vue";
import axios from 'axios';
import { QCard, QCardSection, QForm, QInput, QBtn, QDialog, QIcon, QCardActions } from "quasar";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "FormularioRegistro",
  components: {
    QCard,
    QCardSection,
    QForm,
    QInput,
    QBtn,
    QDialog,
    QIcon,
    QCardActions
  },

  setup() {
    const router = useRouter();
    const nombreUsuario = ref("");
    const correo = ref("");
    const contrasena = ref("");
    const cargando = ref(false);
    const mostrarAlerta = ref(false);
    const mostrarError = ref(false);
    const mensajeError = ref("");
    const errorCorreo = ref("");

    const registrarUsuario = () => {
      if (!nombreUsuario.value || !correo.value || !contrasena.value) {
        mensajeError.value = "Todos los campos son obligatorios.";
        mostrarError.value = true;
        return;
      }

      if (!esCorreoValido(correo.value)) {
        errorCorreo.value = "Correo no válido.";
        return;
      }

      cargando.value = true;
      mostrarAlerta.value = true;

      axios
        .post("http://localhost:3900/api/registro", { 
          nombreUsuario: nombreUsuario.value,
          correo: correo.value,
          contraseña: contrasena.value,
        })
        .then((response) => {
          console.log("Registro Echo:", response.data);
          const token = response.data.token;
          localStorage.setItem('token', token); // Guardar el token en localStorage
          cargando.value = false;
          mostrarAlerta.value = false;
          router.push("/home").then(() => {
            window.location.reload(); // Recargar la página después esto es para que detecte el Token 
          });
        })
        .catch((err) => {
          cargando.value = false;
          mostrarAlerta.value = false;
          mensajeError.value = err.response.data.mensaje || "Error al registrar la cuenta";
          mostrarError.value = true;
          console.error(err);
        });
    };

    const resetFormulario = () => {
      nombreUsuario.value = "";
      correo.value = "";
      contrasena.value = "";
      mostrarError.value=false;
    };

    const esCorreoValido = (correo) => {
      const emailtest = /\S+@\S+\.\S+/;
      return emailtest.test(correo);
    };

    return {
      nombreUsuario,
      correo,
      contrasena,
      cargando,
      mostrarAlerta,
      mostrarError,
      mensajeError,
      registrarUsuario,
      resetFormulario,
      esCorreoValido,
    };
  },
});
</script>

<style scoped>
#content {
  width: 70%;
  float: left;
  min-height: 67.9vh;
  margin-right: 20px;
}

.subheader {
  font-size: 38px;
  width: 100%;
  border-bottom: 1px solid rgb(218, 38, 38);
  padding-bottom: 10px;
  padding-left: 3%;
}

.botones {
  color: #fff;
  background-color: rgba(0, 28, 73, 1);
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.botones:hover {
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
</style>
