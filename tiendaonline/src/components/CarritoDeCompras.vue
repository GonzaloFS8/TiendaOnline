<template>
  <section id="carrito" v-if="userId">
    <div class="carrito-content" v-if="carrito.length > 0">
      <h2>Tu Carrito de Compras</h2>
    
      <div class="carrito-info" v-for="(item, index) in carrito" :key="`item-${index}`">
        <div class="item-carrito">
          <q-img
            :src="'http://localhost:3900/api/get-images/' + item.camiseta + '/' + item.imagenes[0]"
            alt="Imagen Camiseta"
            class="carrito-img"
          />
          <div class="info-carrito">
            <p>Equipo: {{ item.detallesCamiseta.equipo }}</p>
            <p>Año: {{ item.detallesCamiseta.año }}</p>
            <p>Equipación: {{ item.detallesCamiseta.equipacion }}</p>
            <p>Precio:{{ item.detallesCamiseta.precio }}.00€</p>
            <p>Talla: {{ item.talla }}</p>
            <p>Jugador: {{ item.jugador }}</p>
            <div class="quantity-controls">
              <q-btn flat round icon="remove" @click="actualizarCantidad(item._id, item.cantidad - 1)" :disable="item.cantidad <= 1"></q-btn>
              <span>{{ item.cantidad }}</span>
              <q-btn flat round icon="add" @click="actualizarCantidad(item._id, item.cantidad + 1)"></q-btn>
            </div>
            <q-btn round icon="delete" color="red" @click="eliminarDelCarrito(item._id)"></q-btn>
            
          </div>
        </div>
      </div>
      <q-btn class="eliminar"  @click="abrirDialogoPedido">Realizar Pedido (Total: {{ totalCarrito }}€)</q-btn>
      <q-btn color="negative" label="Eliminar Todo el Carrito" @click="eliminarCarrito"/>
    </div>
    <div v-else>
      <p>No hay elementos en el carrito.</p>
    </div>

    
    <q-dialog v-model="dialogoPedido" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Información de Dirección</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="realizarPedido">
            <q-input v-model="direccion.localidad" label="Localidad" required />
            <q-input v-model="direccion.calle" label="Calle" required />
            <q-input v-model="direccion.codigoPostal" label="Código Postal" required />
            <q-input v-model="direccion.piso" label="Portal Y Piso" />
            <div class="q-mt-md q-display-flex q-justify-end">
              <q-btn label="Cancelar" @click="dialogoPedido = false" color="negative" />
              <q-btn type="submit" label="Realizar Pedido" class="eliminar"  />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </section>
  <section v-else>

    <formulario-inicio></formulario-inicio>
  </section>
</template> 

<script>
import { defineComponent, ref, onMounted,computed  } from 'vue';
import axios from 'axios';
import { QCard, QImg, QCardSection, QInput, QForm, QBtn, QDialog } from 'quasar';
import {jwtDecode} from 'jwt-decode';
import FormularioInicio from './FormularioInicio.vue';
export default defineComponent({
  name: 'CarritoDeCompras',
  components: {
    QCard,
    QImg,
    QCardSection,
    QInput,
    QForm,
    QBtn,
    QDialog,
    FormularioInicio
  },
  setup() {
    const carrito = ref([]);
    const userId = ref(null);
    const userRole=ref(null);
    const dialogoPedido = ref(false);
    const direccion = ref({
      localidad: '',
      calle: '',
      codigoPostal: '',
      piso: ''
    });

    const DecodificarToken = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        userId.value = decodedToken.userId;
        userRole.value=decodedToken.userRole;
      }
    }
   
    const obtenerCarrito = () => {
      DecodificarToken();
      axios.post(`http://localhost:3900/api/obtener-carrito`, { idUsuario: userId.value })
        .then(response => {
          carrito.value = response.data.carrito;
          obtenerDetallesCamisetas();
          console.log('CAAARRITO',carrito.value)
        })
        .catch(error => {
          console.error('Error al obtener el carrito:', error);
        });
    }

    const eliminarDelCarrito = (idItem) => {
      axios.delete('http://localhost:3900/api/eliminar-del-carrito', { data: { idUsuario: userId.value, idItem: idItem } })
        .then(() => {
          obtenerCarrito();
        })
        .catch(error => {
          console.error('Error al eliminar del carrito:', error);
        });
    }

    const eliminarCarrito = () => {
      axios.delete('http://localhost:3900/api/eliminar-carrito', { data: { idUsuario: userId.value } })
        .then(() => {
          obtenerCarrito();
        })
        .catch(error => {
          console.error('Error al eliminar el carrito:', error);
        });
    }

    const actualizarCantidad = (idItem, nuevaCantidad) => {
      axios.post('http://localhost:3900/api/actualizar-cantidad-carrito', { idUsuario: userId.value, idItem, nuevaCantidad })
        .then(() => {
          obtenerCarrito();
        })
        .catch(error => {
          console.error('Error al actualizar la cantidad:', error);
        });
    }

    const abrirDialogoPedido = () => {
      dialogoPedido.value = true;
    }

    const realizarPedido = () => {
    axios.post('http://localhost:3900/api/realizar-pedido', { 
    idUsuario: userId.value,
    direccion: direccion.value,
  })
  .then(() => {
    dialogoPedido.value = false;
    obtenerCarrito();
  })
  .catch(error => {
    console.error('Error al realizar el pedido:', error);
  });
}

    const obtenerDetallesCamisetas = () => {
      carrito.value.forEach(item => {
        axios.get(`http://localhost:3900/api/camiseta/${item.camiseta}`)
          .then(response => {
            item.detallesCamiseta = response.data.camiseta;
          })
          .catch(error => {
            console.error('Error al obtener los detalles de la camiseta:', error);
          });
      });
    }

    const totalCarrito = computed(() => {
      let total = 0;
      carrito.value.forEach(item => {
        total += item.detallesCamiseta.precio * item.cantidad;
      });
      return total.toFixed(2);
    });

    onMounted(() => {
      obtenerCarrito();
    });

    return {
      totalCarrito,
      carrito,
      dialogoPedido,
      direccion,
      eliminarDelCarrito,
      eliminarCarrito,
      actualizarCantidad,
      abrirDialogoPedido,
      realizarPedido,
      userRole,
      userId
    };
  }
});
</script>

<style scoped>
#carrito {
  width: 70%;
  float: left;
  min-height: 67.9vh;
  margin-right: 20px;
}

.carrito-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item-carrito {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
}

.carrito-img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  margin-right: 20px;
}

.info-carrito {
  flex: 1;
}

.quantity-controls {
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-left: 30%
}

.quantity-controls q-btn {
  margin: 0 5px;
}

.eliminar{
  color: white;
 background-color:rgba(0, 28, 73, 1);
}
</style>
