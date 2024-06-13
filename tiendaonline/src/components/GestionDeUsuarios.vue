<template>
  <section id="content">
    <q-toolbar>
      <q-toolbar-title>Gestión de Usuarios</q-toolbar-title>
    </q-toolbar>
    
    <div v-for="usuario in usuarios" :key="usuario._id" class="usuario-card q-pa-md">
      <div class="usuario-info">
        <p><strong>Nombre de Usuario:</strong> {{ usuario.nombreUsuario }}</p>
        <p><strong>Correo:</strong> {{ usuario.correo }}</p>
        <p><strong>Role:</strong> {{ usuario.role }}</p>
        <p><strong>Número de Pedidos:</strong> {{ usuario.pedidos.length }}</p>
      </div>
      <div class="actions">
        <q-btn @click="verPedidos(usuario._id)" text-color="white" label="Ver Pedidos" class="ver-pedidos-btn"/>
        <q-btn @click="eliminarUsuario(usuario._id)" color="negative" label="Eliminar Usuario" class="eliminar-btn"/>
      </div>
    </div>
    
    <q-dialog v-model="dialogoPedidos"  scroll>
      <q-card v-if="usuarioSeleccionado">
        <q-toolbar>
          <q-toolbar-title>Pedidos de {{ usuarioSeleccionado.nombreUsuario }}</q-toolbar-title>
          <q-btn icon="close" flat round dense @click="dialogoPedidos = false;" />
        </q-toolbar>
        <q-card-section v-if="pedidos.length">
          <div v-for="pedido in pedidos" :key="pedido._id" class="pedido-item">
            <p><strong>Fecha:</strong> {{ new Date(pedido.fecha).toLocaleDateString() }}</p>
            <p><strong>Camisetas:</strong></p>
            <ul>
              <li v-for="item in pedido.items" :key="item._id">
                {{ item.camiseta }} - {{ item.talla }} - {{ item.jugador }} - Cantidad: {{ item.cantidad }} 
                <q-btn flat round icon="info" @click="obtenerCamiseta(item.camiseta)" />
               
              </li>
            </ul>
            <p><strong>Dirección:</strong> {{ pedido.direccion }}</p>
            <strong>¿PEDIDO ENVIADO?:</strong>
            <q-btn  flat round icon="local_shipping" @click="eliminarPedido(pedido._id)" color="negative"  >SI</q-btn>
          </div>
        </q-card-section>
        <q-card-section v-else>
          <p>No hay pedidos.</p>
        </q-card-section>
      </q-card>
    </q-dialog>
    
    <q-dialog v-model="dialogoDetallesCamiseta" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Detalles de la Camiseta</div>
        </q-card-section>
        
        <q-card-section>
          <p><strong>Equipo:</strong> {{ detallesCamiseta.equipo }}</p>
          <p><strong>Precio:</strong> {{ detallesCamiseta.precio }}€</p>
          <p><strong>Año:</strong> {{ detallesCamiseta.año }}€</p>
          <p><strong>Equipacion:</strong> {{ detallesCamiseta.equipacion }}</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat round dense icon="close" @click="dialogoDetallesCamiseta = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { QToolbar, QToolbarTitle, QBtn, QDialog, QCard, QCardSection, QCardActions } from 'quasar';

export default defineComponent({
  name: 'GestionUsuarios',
  components: {
    QToolbar,
    QToolbarTitle,
    QBtn,
    QDialog,
    QCard,
    QCardSection,
    QCardActions,
  },
  setup() {
    const usuarios = ref([]);
    const dialogoPedidos = ref(false);
    const pedidos = ref([]);
    const usuarioSeleccionado = ref({});
    const detallesCamiseta = ref({ equipo: '', precio: '' });
    const dialogoDetallesCamiseta = ref(false);

    const obtenerUsuarios = () => {
      axios.get('http://localhost:3900/api/obtener-usuarios')
        .then(response => {
          usuarios.value = response.data.usuarios;
        })
        .catch(error => {
          console.error('Error al obtener los usuarios:', error);
        });
    };

    const eliminarUsuario = (idUsuario) => {
      axios.delete('http://localhost:3900/api/eliminar-usuario', { data: { idUsuario } })
        .then(() => {
          obtenerUsuarios();
        })
        .catch(error => {
          console.error('Error al eliminar el usuario:', error);
        });
    };

    const verPedidos = (idUsuario) => {
      axios.get(`http://localhost:3900/api/obtener-pedidos-usuario/${idUsuario}`)
        .then(response => {
          pedidos.value = response.data.pedidos;
          usuarioSeleccionado.value = usuarios.value.find(usuario => usuario._id === idUsuario);
          dialogoPedidos.value = true;
        })
        .catch(error => {
          console.error('Error al obtener los pedidos del usuario:', error);
        });
    };

   

    const obtenerCamiseta = (camisetaId) => {
      axios.get(`http://localhost:3900/api/camiseta/${camisetaId}`)
        .then(response => {
          detallesCamiseta.value.equipo = response.data.camiseta.equipo;
          detallesCamiseta.value.precio = response.data.camiseta.precio;
          detallesCamiseta.value.año=response.data.camiseta.año;
          detallesCamiseta.value.equipacion=response.data.camiseta.equipacion;
          dialogoDetallesCamiseta.value = true;
        })
        .catch(error => {
          console.error('Error al obtener los detalles de la camiseta:', error);
        });
    };

    const eliminarPedido = (idPedido) => {
      axios.delete('http://localhost:3900/api/eliminar-pedido', { data: { idUsuario: usuarioSeleccionado.value._id, idPedido } })
        .then(() => {
          const index = pedidos.value.findIndex(pedido => pedido._id === idPedido);
          if (index !== -1) {
            pedidos.value.splice(index, 1);
          }
        })
        .catch(error => {
          console.error('Error al eliminar el pedido:', error);
        });
    };


    onMounted(() => {
      obtenerUsuarios();
    });

    return {
      usuarios,
      eliminarUsuario,
      verPedidos,
      dialogoPedidos,
      pedidos,
      usuarioSeleccionado,
      detallesCamiseta,
      obtenerCamiseta,
      dialogoDetallesCamiseta,
      eliminarPedido,
    };
  },
});
</script>

<style scoped>
.usuario-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
  padding: 16px;
  margin-bottom: 16px;
}

.usuario-info {
  margin-left: 30%;
}

.actions {
  display: flex;
  flex-direction: column;
}

.ver-pedidos-btn,
.eliminar-btn {
  background-color: rgba(0, 28, 73, 1);
  margin-bottom: 8px;
}

</style>
